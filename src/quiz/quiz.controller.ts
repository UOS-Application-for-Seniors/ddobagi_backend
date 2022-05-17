import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  SetMetadata,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizEntity } from './entities/quiz.entity';
import { UserDataDto } from 'src/users/dto/user-data-dto';
import { Public } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ResultDto } from './dto/result-dto';

@Controller('quiz')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private userService: UsersService,
  ) {}

  @Public()
  @Get(':gameid/:quizid')
  getQuizInformation(
    @Param('gameid') gameid: number,
    @Param('quizid') quizid: number,
  ) {
    return this.quizService.findQuiz(gameid, quizid);
  }

  @Public()
  @Post('/select')
  async getGameSelectionList() {
    return this.quizService.getSelectionList();
  }

  @Post()
  @Public()
  async getRecommendation(dto: UserDataDto) {
    return this.quizService.getRecommendation(dto);
  }

  @Get('/CIST')
  async getCIST(@Request() req) {
    console.log(req.user);
    return this.quizService.getCIST(req.user.id);
  }

  @Public()
  @Post('/DICTQuiz')
  async getDICTQuizScore(@Body() req) {
    return this.quizService.getDICTQuizScore(req.result);
  }

  @Post('/CISTADDResult')
  async addCISTResult(@Body() body: ResultDto, @Request() req) {
    return this.userService.addCISTResult(body.gameID, body.score, req.user.id);
  }

  //@Post('/CISTResult')

  /*
  @Get('/DICT')
  async getDICT() {
    return this.quizService.getDICT();
  }

  @Public()
  @Post('/DICT2')
  async getDICT2(@Req() request) {
    return this.quizService.getDICT2();
  }
  */
}
