import {
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserDataDto } from 'src/users/dto/user-data-dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, Not, Repository } from 'typeorm';
import { GameEntity } from './entities/game.entity';
import { QuizEntity } from './entities/quiz.entity';
// import * as dictJSON from '../966314_8026.json';
import { AnimalEntity } from './entities/animal.entity';
import { json } from 'stream/consumers';
import { delay } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { GameDto } from './dto/game-dto';
import { plainToClass } from 'class-transformer';
import { Console } from 'console';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AnimalEntity)
    private animalRepository: Repository<AnimalEntity>,
    private readonly userService: UsersService,
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

    var shuffledDTOArray: Array<GameDto> = [];
    for (const game of shuffled) {
      var temp = plainToClass(GameDto, game);

      //이유를 모르겠는데, rowid 0은 찾지 못하는 버그가 있음.            IMPORTANT

      const quiz = await this.quizRepository.findAndCount({
        where: { game: game },
      });
      temp.quizid = Math.floor(Math.random() * quiz[1]);
      temp.difficulty = quiz[0][temp.quizid].difficulty;
      shuffledDTOArray.push(temp);
    }

    return shuffledDTOArray;
  }

  async getCIST(userid: string) {
    const games = await this.gameRepository.find({
      where: { field: 'CIST' },
      order: { gameid: 'ASC' },
    });

    this.userService.resetCIST(userid);

    return games;
  }

  async getSelectionList() {
    const games = await this.gameRepository.find({
      where: { field: Not('CIST') },
      order: { gameid: 'ASC' },
    });

    console.log(games);

    return games;
  }

  async getDICTQuizScore(answer: string) {
    var score = 0;
    var result_array = answer.split(',');

    for (const word of result_array) {
      const tmp = await this.animalRepository.findOne({ animalName: word });
      if (tmp) {
        score++;
      }
    }

    return {
      score: score,
    };
  }

  /*
  async getDICT2() {
    var word = dictJSON.channel.item;
    var words = new Array<string>();

    word.forEach(async (wordData) => {
      var temp = wordData.word_info.word;
      temp = temp.toString().replace('-', '');
      var dictWord = temp.replace(/[0-9]/g, '');
      console.log('replaced word is ' + dictWord);
      if (words.includes(dictWord)) {
      } else {
        words.push(dictWord);
      }
    });
    await this.getAnimalData(words);
  }

  async getAnimalData(animalName: Array<string>) {
    animalName.forEach(async (name) => {
      await this.animalRepository.save(
        new AnimalEntity({
          animalName: name,
        }),
      );
    });
  }
  */

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
      case 0:
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
