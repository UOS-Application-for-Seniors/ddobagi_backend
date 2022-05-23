import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDataEntity } from './entities/userData.entity';
import { RegisterUserDto } from './dto/create-register';
import { NOKEntity } from './entities/NOK.entity';
import { use } from 'passport';
import { SmsService } from 'src/sms/sms.service';
import { response } from 'express';
import { VirtualAction } from 'rxjs';
import { UserRecordEntity } from './entities/userRecord.entity';
import { GameEntity } from 'src/quiz/entities/game.entity';
import { time } from 'console';
import { ApiProperty } from '@nestjs/swagger';
import { UserDifficultyEntity } from './entities/userDiffculty.entity';
import { UpdateUserDto } from './dto/update-user-dto';
import { NOKDTO } from './dto/NOK-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(UserDataEntity)
    private usersDataRepository: Repository<UserDataEntity>,
    @InjectRepository(NOKEntity)
    private NOKRepository: Repository<NOKEntity>,
    @InjectRepository(UserRecordEntity)
    private userRecordRepository: Repository<UserRecordEntity>,
    @InjectRepository(UserDifficultyEntity)
    private userDiffcultyRepository: Repository<UserDifficultyEntity>,
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
    private SMSService: SmsService,
    private connection: Connection,
  ) {}

  private readonly DIFFICULTY_COST_NORMAL = 5000;
  private readonly DIFFICULTY_COST_HARD = 10000;

  async saveUser(user: RegisterUserDto) {
    const userEntity = new UserEntity({
      id: user.id,
      name: user.name,
      userBirthDate: user.userBirthDate,
      userEducationLevel: user.userEducationLevel,
      address: user.address,
      password: user.password,
      userRefreshToken: '',
      totalStars: 0,
    });
    await this.usersRepository.save(userEntity);
    await this.usersDataRepository.save(
      new UserDataEntity({
        field1: 0,
        field2: 0,
        field3: 0,
        field4: 0,
        CIST: 0,
        PastCIST: 0,
        user: userEntity,
      }),
    );
    if (user.NOKName) {
      const date = new Date(Date.now());
      date.setDate(date.getDate() + user.NOKNotificationDays);
      await this.NOKRepository.save(
        new NOKEntity({
          NOKName: user.NOKName,
          NOKPhoneNumber: user.NOKPhoneNumber,
          NOKNotificationDays: user.NOKNotificationDays,
          NextNotificationDate: date.toJSON().substring(0, 10),
          user: userEntity,
        }),
      );
    }
  }

  async findOne(userid: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ id: userid });
  }

  async checkExist(userid: string) {
    const count = await this.usersRepository.count({ id: userid });
    return count;
  }

  async getUserData(userid: string): Promise<UserDataEntity> {
    const user = await this.usersRepository.findOne({ id: userid });
    const data = await this.usersDataRepository.findOne({
      user: user,
    });

    return data;
  }

  async getProfile(userid: string) {
    const data = await this.usersDataRepository.findOne({
      user: await this.usersRepository.findOne({ id: userid }),
    });

    return data;
  }

  async getAddress(userid: string) {
    const data = await this.usersRepository.findOne({ id: userid });

    return data.address;
  }

  async getUserResult(userid: string) {
    console.log(userid);
    // get user record  using userid

    const data: UserRecordEntity[] = await this.connection
      .createQueryBuilder(UserRecordEntity, 'record')
      .leftJoinAndSelect('record.game', 'game')
      .orderBy('game.gamename', 'ASC')
      .addOrderBy('difficulty', 'ASC')
      .getMany();

    var returnObjectArray = new Array<ReturnObject>();

    data.forEach(async (gameRecord) => {
      // calculate star
      const stars = gameRecord.correctPlay * 2 + gameRecord.totalPlay;
      // calculate correctRate
      const correctRate =
        Math.ceil((gameRecord.correctPlay / gameRecord.totalPlay) * 100) / 100;
      // const difficulty = gameRecord.difficulty
      const gameName = gameRecord.game.gamename;
      // return star, Rate, difficulty, gamename
      const newObject = new ReturnObject({
        gameName: gameName,
        stars: stars,
        correctRate: correctRate,
        difficulty: gameRecord.difficulty,
      });
      returnObjectArray.push(newObject);
    });

    return returnObjectArray;
  }

  async updateUserRefreshToken(userid: string, token: string) {
    let data = await this.usersRepository.findOne({ id: userid });
    data.userRefreshToken = token;
    await this.usersRepository.save(data);
  }

  async checkDate(date: string) {
    const data = await this.NOKRepository.find({
      NextNotificationDate: date,
    });
    if (data) {
      data.forEach(async (entity) => {
        var CISTscore = 0;
        const date = new Date(Date.now());

        // Finding UserDataEntity with NOKEntity
        const tmpEntity = await this.usersDataRepository.findOne({
          user: entity.user,
        });
        CISTscore = tmpEntity.CIST;

        // Sending SMS
        this.SMS(entity.NOKPhoneNumber, CISTscore);

        // Setting Next Notification Date
        date.setDate(date.getDate() + entity.NOKNotificationDays);
        entity.NextNotificationDate = date.toJSON().substring(0, 10);
        console.log('Next Notification Date is ' + entity.NextNotificationDate);
        this.NOKRepository.save(entity);
      });
    }
  }

  async resetCIST(userid: string) {
    const userData = await this.getUserData(userid);

    userData.PastCIST = userData.CIST;
    userData.CIST = 0;

    await this.usersDataRepository.save(userData);
  }

  async addCISTResult(gameid: string, score: number, userid: string) {
    var user = await this.usersRepository.findOne({ id: userid });
    var userData = await this.usersDataRepository.findOne({
      user: user,
    });

    /*
    var userData = await this.usersDataRepository.findOne({
      where: {user : { id : userid}}
    });
    */

    userData.CIST = score + userData.CIST;
    if (gameid == '54') {
      var NOK = await this.NOKRepository.findOne({ user: user });
      var scoreStandard = await this.getCISTResult(
        user.userBirthDate,
        user.userEducationLevel,
        userData.CIST,
      );

      if (scoreStandard != 0) {
        await this.SMSService.CISTDangerSMS(
          user.name,
          NOK.NOKPhoneNumber,
          userData.CIST,
          scoreStandard,
        );
        console.log('sended');
      }
    }

    await this.usersDataRepository.save(userData);
  }

  async getCISTResult(
    userBirthDate: string,
    userEducationLevel: number,
    CISTScore: number,
  ) {
    const date = new Date();
    const age =
      date.getFullYear() - parseInt(userBirthDate.substring(0, 4)) + 1;
    const dementiaScore = [
      [0, 0, 21, 23, 25, 26],
      [0, 15, 20, 22, 24, 25],
      [12, 13, 18, 21, 21, 24],
      [9, 10, 15, 17, 19, 21],
    ];
    var ageRow = 0;
    var educationLevelCol = userEducationLevel;

    if (age < 60) {
      ageRow = 0;
    } else if (age >= 60 && age < 70) {
      ageRow = 1;
    } else if (age >= 70 && age < 80) {
      ageRow = 2;
    } else if (age >= 80) {
      ageRow = 3;
    } else {
      return 0;
    }

    if (dementiaScore[ageRow][educationLevelCol] > CISTScore) {
      return dementiaScore[ageRow][educationLevelCol];
    } else {
      return 0;
    }
  }

  async saveGameResult(
    userid: string,
    gameid: string,
    score: string,
    difficulty: string,
    coin: string,
  ) {
    //difficulty = '0';
    var gameID = parseInt(gameid);
    var difficultyInt = parseInt(difficulty);
    var coinInt = parseInt(coin);

    var game = await this.gameRepository.findOne({ gameid: gameID });
    var user = await this.usersRepository.findOne({ id: userid });

    var resultEntity = await this.userRecordRepository.findOne({
      where: {
        game: { gameid: gameid },
        user: { id: userid },
        difficulty: difficultyInt,
      },
    });

    if (resultEntity == undefined) {
      var resultEntity = new UserRecordEntity({
        totalPlay: 0,
        correctPlay: 0,
        game: game,
        user: user,
        difficulty: difficultyInt,
      });

      await this.userRecordRepository.create(resultEntity);
    }

    // Score에 따라서 ResultRecord 계산

    switch (score) {
      case '0':
        resultEntity.totalPlay = resultEntity.totalPlay + 1;

        break;
      case '1':
        resultEntity.correctPlay = resultEntity.correctPlay + 1;
        resultEntity.totalPlay = resultEntity.totalPlay + 1;
        break;
      case '2':
        resultEntity.correctPlay = resultEntity.correctPlay + 0.5;
        resultEntity.totalPlay = resultEntity.totalPlay + 1;
        break;
    }

    user.totalStars += coinInt;

    await this.userRecordRepository.save(resultEntity);
    await this.usersRepository.save(user);
    console.log('saveGameResult Complete');
  }

  SMS(number: string, score: number) {
    try {
      this.SMSService.sendSMS(number, score);
    } catch (e) {
      console.log(e);
    }
  }

  async unlockDifficulty(userid, gameidString, difficultyString) {
    console.log(userid);
    let gameid = parseInt(gameidString);
    let difficulty = parseInt(difficultyString);
    let user = await this.usersRepository.findOne({ id: userid });
    let game = await this.gameRepository.findOne({ gameid: gameid });

    console.log(user);

    if (difficulty == 1) {
      if (user.totalStars < this.DIFFICULTY_COST_NORMAL) {
        console.log('here');
        // TODO : Setup Stars
        throw new HttpException('Not Enough Stars', HttpStatus.NOT_ACCEPTABLE);
      } else {
        console.log('here2');
        let newDif = new UserDifficultyEntity({
          user: user,
          game: game,
          difficulty: 1,
        });
        user.totalStars -= this.DIFFICULTY_COST_NORMAL;
        await this.userDiffcultyRepository.save(newDif);
        await this.usersRepository.save(user);
        return;
      }
    }

    if (difficulty == 2) {
      if (user.totalStars < this.DIFFICULTY_COST_HARD) {
        // TODO : Setup Stars
        throw new HttpException('Not Enough Stars', HttpStatus.NOT_ACCEPTABLE);
      } else {
        let dif = await this.userDiffcultyRepository.findOne({
          where: {
            user: user,
            game: game,
          },
        });

        dif.difficulty = 2;
        user.totalStars -= this.DIFFICULTY_COST_HARD;
        await this.userDiffcultyRepository.save(dif);
        await this.usersRepository.save(user);
        return;
      }
    }
  }

  async updateUser(userid: string, updateData: UpdateUserDto) {
    const {
      NOKID,
      NOKName,
      NOKNotificationDays,
      NOKPhoneNumber,
      ...userDataUpdate
    } = updateData;
    const {
      id,
      address,
      userBirthDate,
      userEducationLevel,
      password,
      name,
      ...NOKDataUpdate
    } = updateData;
    await this.usersRepository.update(userid, userDataUpdate);
    await this.NOKRepository.update({ user: { id: userid } }, NOKDataUpdate);
  }

  async findMaxDif(gameid, userid) {
    let temp = await this.userDiffcultyRepository.findOne({
      user: { id: userid },
      game: { gameid: gameid },
    });

    if (temp == undefined) {
      return 0;
    }

    return temp.difficulty;
  }

  async getCoin(userid) {
    let temp = await this.usersRepository.findOne({ id: userid });

    return temp.totalStars;
  }

  async updateUserRecord() {
    const gameField = [
      '지남력',
      '시공간기능',
      '주의집중력',
      '기억력',
      '실행기능',
      '언어기능',
    ];
    const users = await this.usersRepository.find();
    for (const user of users) {
      for (const field of gameField) {
        let totalPlay = 0;
        let correctPlay = 0;
        let games = await this.gameRepository.find({ field: field });
        for (const game of games) {
          let userRecord = await this.userRecordRepository.find({
            where: { user: user, game: game },
          });
          for (let record of userRecord) {
            correctPlay += record.correctPlay;
            totalPlay += record.totalPlay;
          }
        }

        let userData = await this.usersDataRepository.findOne({
          user: user,
        });
        let successRate;
        if (totalPlay == 0) {
          successRate = 0;
        } else {
          successRate = correctPlay / totalPlay;
        }

        switch (field) {
          case '지남력':
            userData.field1 = successRate;
            break;
          case '시공간기능':
            userData.field2 = successRate;
            break;
          case '주의집중력':
            userData.field3 = successRate;
            break;
          case '기억력':
            userData.field4 = successRate;
            break;
          case '실행기능':
            userData.field5 = successRate;
            break;
          case '언어기능':
            userData.field6 = successRate;
            break;
        }

        await this.usersDataRepository.save(userData);
      }
    }
  }
}

export class ReturnObject {
  @ApiProperty()
  gameName: string;

  @ApiProperty()
  stars: number;
  @ApiProperty()
  correctRate: number;
  @ApiProperty()
  difficulty: number;

  constructor(partial: Partial<ReturnObject>) {
    Object.assign(this, partial);
  }
}
