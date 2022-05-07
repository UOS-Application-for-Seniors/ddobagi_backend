import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/users/dto/user-data-dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { GameEntity } from './entities/game.entity';
import { QuizEntity } from './entities/quiz.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findQuiz(gameid: number, quizid: number): Promise<QuizEntity> {
    var quiz = await this.quizRepository.findOne({
      quizid: quizid,
      game: await this.gameRepository.findOne({ gameid: gameid }),
    });

    if (quiz.quizanswer.startsWith('ANSWER')) {
      var date = new Date();
      switch (quiz.quizanswer) {
        case 'ANSWERYEAR':
          quiz.quizanswer = date.getFullYear().toString();
          break;
        case 'ANSWERMONTH':
          quiz.quizanswer = (date.getMonth() + 1).toString();
          break;
        case 'ANSWERDATE':
          quiz.quizanswer = date.getDate().toString();
          break;
        default:
          quiz.quizanswer = this.dayToString(date.getDay());
          break;
      }
    }

    return quiz;
  }

  async getRecommendation(data: UserDataDto) {
    /* TODO MAKE RECOMMENDATION ALGORITHM
    return Array;
    */
    const games = await this.gameRepository.find({
      where: { field: Not('CIST') },
      order: { gameid: 'ASC' },
    });
    var shuffled = this.shuffle(games);

    return shuffled;
  }

  async getCIST(userid: String) {
    /* TODO MAKE RECOMMENDATION ALGORITHM
    return Array;
    */
    const games = await this.gameRepository.find({
      where: { field: 'CIST' },
      order: { gameid: 'ASC' },
    });

    return games;
  }

  dayToString(day: number) {
    switch (day) {
      case 1:
        return '월요일';
        break;
      case 2:
        return '화요일';
        break;
      case 3:
        return '수요일';
        break;
      case 4:
        return '목요일';
        break;
      case 5:
        return '금요일';
        break;
      case 6:
        return '토요일';
        break;
      case 7:
        return '일요일';
        break;
      default:
        return 'error';
        break;
    }
  }

  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}
