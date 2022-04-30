import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizEntity } from './entities/quiz.entity';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get(':id')
  getQuizInformation(@Param('id') id: number) {
    return this.quizService.findQuiz(id);
  }
}
