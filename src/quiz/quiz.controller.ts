import {
  Controller,
  Get,
  Post,
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

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get(':gameid/:quizid')
  @Public()
  getQuizInformation(
    @Param('gameid') gameid: number,
    @Param('quizid') quizid: number,
  ) {
    return this.quizService.findQuiz(gameid, quizid);
  }

  @Public()
  @Post()
  async getRecommendation(dto: UserDataDto) {
    await this.quizService.getRecommendation(dto);
  }

  @Get('/CIST')
  async getCIST(@Req() req) {
    return this.quizService.getCIST(req.user.id);
  }
}
