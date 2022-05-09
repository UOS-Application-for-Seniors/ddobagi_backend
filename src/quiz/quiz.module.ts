import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizEntity } from './entities/quiz.entity';
import { GameEntity } from './entities/game.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { AnimalEntity } from './entities/animal.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizEntity,
      GameEntity,
      UserEntity,
      AnimalEntity,
    ]),
    UsersModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
