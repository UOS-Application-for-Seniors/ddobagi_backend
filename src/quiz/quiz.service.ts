import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
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

  async returnQuizList(gameid: string, difficulty: string) {
    const gameID = parseInt(gameid);
    const difficultyInt = parseInt(difficulty);
    const game = await this.gameRepository.findOne({ gameid: gameID });

    console.log(gameID);
    console.log(difficultyInt);

    let quizListArray: Array<GameDto> = [];
    let quiz = await this.quizRepository.findAndCount({
      where: { game: { gameid: gameID }, difficulty: difficultyInt },
    });

    console.log(quiz);
    if (quiz[1] < 3) {
      throw new HttpException('Not Enough Quiz!', HttpStatus.NOT_ACCEPTABLE);
    }

    let randomArray = this.randomIndexArray(quiz[1]);

    for (let randomValue of randomArray) {
      let temp = plainToClass(GameDto, quiz[0][randomValue]);
      temp.gameid = game.gameid;
      temp.field = game.field;
      temp.gamename = game.gamename;
      temp.gamedescript = game.gamedescript;
      temp.usingfragment = game.usingfragment;

      quizListArray.push(temp);
    }

    console.log(quizListArray);
    return quizListArray;
  }

  async getCIST(userid: string) {
    const games = await this.gameRepository.find({
      where: { field: 'CIST' },
      order: { gameid: 'ASC' },
    });

    this.userService.resetCIST(userid);

    var tempID = 0;
    var CISTDTOArray: Array<GameDto> = [];
    for (const game of games) {
      var temp = plainToClass(GameDto, game);

      //이유를 모르겠는데, rowid 0은 찾지 못하는 버그가 있음.            IMPORTANT

      //CIST 10
      if ([36, 44, 45, 46, 47, 48, 49].includes(game.gameid)) {
        temp.quizid = tempID;
        CISTDTOArray.push(temp);
        continue;
      }

      const quiz = await this.quizRepository.count({
        where: { game: game },
      });
      temp.quizid = Math.floor(Math.random() * quiz);

      if (game.gameid == 35) {
        tempID = temp.quizid;
      }

      CISTDTOArray.push(temp);
    }

    return CISTDTOArray;
  }

  async getSelectionList() {
    const games = await this.gameRepository.find({
      where: { field: Not('CIST') },
      order: { gameid: 'ASC' },
    });

    let gameArray: Array<GameDto> = [];
    for (let game of games) {
      let gameTmp = plainToClass(GameDto, game);
      gameTmp.openedDifficulty = 0;
      gameTmp.gamedescript = game.gamedescript;
      gameArray.push(gameTmp);
    }
    console.log(gameArray);

    return gameArray;
  }

  async getSelectionListForUser(userid) {
    const games = await this.gameRepository.find({
      where: { field: Not('CIST') },
      order: { gameid: 'ASC' },
    });

    let gameArray: Array<GameDto> = [];
    for (let game of games) {
      let gameTmp = plainToClass(GameDto, game);
      gameTmp.openedDifficulty = await this.userService.findMaxDif(
        game.gameid,
        userid,
      );
      gameTmp.gamedescript = '간략한 설명';
      gameArray.push(gameTmp);
    }
    console.log(gameArray);

    return gameArray;
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

  randomIndexArray(number: number) {
    //중복을 제외하고 3개의 랜덤 숫자 뽑기
    let randomIndexArray = [];

    for (let i = 0; i < 3; i++) {
      let randomNum = Math.floor(Math.random() * number);
      if (randomIndexArray.indexOf(randomNum) === -1) {
        randomIndexArray.push(randomNum);
      } else {
        i--;
      }
    }

    return randomIndexArray;
  }
}
