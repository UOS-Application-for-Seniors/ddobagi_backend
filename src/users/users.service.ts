import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDataEntity } from './entities/userData.entity';
import { RegisterUserDto } from './dto/create-register';
import { NOKEntity } from './entities/NOK.entity';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(UserDataEntity)
    private usersDataRepository: Repository<UserDataEntity>,
    @InjectRepository(NOKEntity)
    private NOKRepository: Repository<NOKEntity>,
    private connection: Connection,
  ) {}

  async saveUser(user: RegisterUserDto) {
    const userEntity = new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      userBirthDate: user.userBirthDate,
      userEducationLevel: user.userEducationLevel,
      phoneNumber: user.PhoneNumber,
      address: user.Address,
      password: user.password,
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
    if (user.NOKID) {
      const date = new Date(Date.now());
      date.setDate(date.getDate() + user.NOKNotificationDays);
      await this.NOKRepository.save(
        new NOKEntity({
          NOKID: user.NOKID,
          NOKName: user.NOKName,
          NOKPhoneNumber: user.NOKPhoneNumber,
          NOKNotificationDays: user.NOKNotificationDays,
          NextNotificationDate: date.toJSON().substring(0, 10),
          user: userEntity,
        }),
      );
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(userid: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ id: userid });
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async checkExist(userid: string) {
    const count = await this.usersRepository.count({ id: userid });
    return count;
  }

  getUserData(userEntity: UserEntity) {
    const data = this.usersDataRepository.findOne({ user: userEntity });
  }

  async getProfile(userid: string) {
    const data = await this.usersDataRepository.findOne({
      user: await this.usersRepository.findOne({ id: userid }),
    });

    return data;
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

  SMS(number: string, score: number) {
    console.log(
      'Successfully sent SMS to ' + number + ', Score is ' + score.toString(),
    );
  }
}
