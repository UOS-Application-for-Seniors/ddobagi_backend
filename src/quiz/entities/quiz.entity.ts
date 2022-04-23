import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm/index';

@Entity()
export class QuizEntity {
  @PrimaryGeneratedColumn('rowid')
  quizid: number;
  @Column()
  quizdetail: string;
  @Column()
  quizdatapath: string;
  @Column()
  quizanswer: string;
}
