import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDataEntity } from './entities/userData.entity';
import { NOKEntity } from './entities/NOK.entity';
import { JwtModule } from '@nestjs/jwt';
import { SmsModule } from 'src/sms/sms.module';
import { UserRecordEntity } from './entities/userRecord.entity';
import { GameEntity } from 'src/quiz/entities/game.entity';
import { UserDifficultyEntity } from './entities/userDiffculty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserDataEntity,
      NOKEntity,
      UserRecordEntity,
      GameEntity,
      UserDifficultyEntity,
    ]),
    SmsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
