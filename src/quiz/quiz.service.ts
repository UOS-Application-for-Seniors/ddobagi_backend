import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity } from './entities/quiz.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
  ) {}

  findQuiz(id: number): Promise<QuizEntity> {
    return this.quizRepository.findOne({ quizid: id });
  }
}
