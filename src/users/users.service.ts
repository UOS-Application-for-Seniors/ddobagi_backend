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
    await this.usersRepository.save(
      new UserEntity({
        id: user.id,
        name: user.name,
        email: user.email,
        userBirthDate: user.userBirthDate,
        userEducationLevel: user.userEducationLevel,
        phoneNumber: user.PhoneNumber,
        address: user.Address,
        password: user.password,
      }),
    );
    await this.usersDataRepository.save(
      new UserDataEntity({
        field1: 0,
        field2: 0,
        field3: 0,
        field4: 0,
        CIST: 0,
        user: await this.usersRepository.findOne({ id: user.id }),
      }),
    );
    if (user.NOKID) {
      await this.NOKRepository.save(
        new NOKEntity({
          NOKID: user.NOKID,
          NOKName: user.NOKName,
          NOKPhoneNumber: user.NOKPhoneNumber,
          NOKNotificationDays: user.NOKNotificationDays,
          user: await this.usersRepository.findOne({ id: user.id }),
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
}
