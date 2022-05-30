import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm/index';
import { GameEntity } from './game.entity';

@Entity('Quiz')
export class QuizEntity {
  @ApiProperty({ description: '퀴즈 번호' })
  @PrimaryGeneratedColumn('rowid')
  quizid: number;

  @ApiProperty({ description: '퀴즈 설명' })
  @Column()
  quizdetail: string;

  @ApiProperty({ description: '퀴즈 문제 보기' })
  @Column()
  quizchoicesdetail: string;

  @ApiProperty({ description: '퀴즈 문제 그림파일 이름' })
  @Column()
  quizchoicespicture: string;

  @ApiProperty({ description: '퀴즈 난이도' })
  @Column()
  difficulty: string;

  @ApiProperty({ description: '퀴즈 정답' })
  @Column()
  quizanswer: string;

  @ApiProperty({ description: '퀴즈 TTS' })
  @Column()
  quizTTS: string;

  @ManyToOne((type) => GameEntity, (GameEntity) => GameEntity.gameid, {
    primary: true,
    eager: true,
  })
  game: GameEntity;
}
