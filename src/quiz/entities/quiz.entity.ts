import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm/index';

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
}
