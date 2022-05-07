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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(UserDataEntity)
    private usersDataRepository: Repository<UserDataEntity>,
    @InjectRepository(NOKEntity)
    private NOKRepository: Repository<NOKEntity>,
    private SMSService: SmsService,
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
    const data = this.usersDataRepository.findOne({
      user: await this.usersRepository.findOne({ id: userid }),
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

  SMS(number: string, score: number) {
    try {
      this.SMSService.sendSMS(number, score);
    } catch (e) {
      console.log(e);
    }
  }
}
