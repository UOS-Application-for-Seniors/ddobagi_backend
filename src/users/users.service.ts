import { Injectable } from '@nestjs/common';
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
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
    private SMSService: SmsService,
    private connection: Connection,
  ) {}

  async saveUser(user: RegisterUserDto) {
    const userEntity = new UserEntity({
      id: user.id,
      name: user.name,
      userBirthDate: user.userBirthDate,
      userEducationLevel: user.userEducationLevel,
      address: user.Address,
      password: user.password,
      userRefreshToken: '',
    });
    await this.usersRepository.save(userEntity);
    await this.usersDataRepository.save(
      new UserDataEntity({
        field1: 0,
        field2: 0,
        field3: 0,
        field4: 0,
        CIST: 0,
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
      var NOK = await this.NOKRepository.findOne({ user: { id: userid } });

      console.log(NOK);
      this.SMS(NOK.NOKPhoneNumber, userData.CIST);
    }

    await this.usersDataRepository.save(userData);
  }

  async saveGameResult(
    userid: string,
    gameid: string,
    score: string,
    difficulty: string,
  ) {
    //difficulty = '0';
    var gameID = parseInt(gameid);
    var difficultyInt = parseInt(difficulty);

    var game = await this.gameRepository.findOne({ gameid: gameID });
    var user = await this.usersRepository.findOne({ id: userid });

    console.log('here');
    console.log(game);

    var resultEntity = await this.userRecordRepository.findOne({
      where: {
        game: { gameid: gameid },
        user: { id: userid },
        difficulty: difficultyInt,
      },
    });

    console.log('here2');

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

    await this.userRecordRepository.save(resultEntity);
    console.log('saveGameResult Complete');
  }

  SMS(number: string, score: number) {
    try {
      this.SMSService.sendSMS(number, score);
    } catch (e) {
      console.log(e);
    }
  }
}

export class ReturnObject {
  gameName: string;
  stars: number;
  correctRate: number;
  difficulty: number;

  constructor(partial: Partial<ReturnObject>) {
    Object.assign(this, partial);
  }
}
