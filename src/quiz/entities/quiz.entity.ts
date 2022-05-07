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
  @PrimaryGeneratedColumn('rowid')
  quizid: number;
  @Column()
  quizdetail: string;
  @Column()
  quizchoicesdetail: string;
  @Column()
  quizdatapath: string;
  @Column()
  quizanswer: string;
  @Column()
  quizTTS: string;

  @ManyToOne((type) => GameEntity, (GameEntity) => GameEntity.gameid, {
    primary: true,
    eager: true,
  })
  game: GameEntity;
}
