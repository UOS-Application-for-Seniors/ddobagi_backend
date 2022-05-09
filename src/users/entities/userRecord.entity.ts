import { GameEntity } from 'src/quiz/entities/game.entity';
import internal from 'stream';
import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('UserRecord')
export class UserRecordEntity {
  @PrimaryGeneratedColumn()
  recordid: number;

  @Column({ type: 'float' })
  correctPlay: number;

  @Column({ type: 'float' })
  totalPlay: number;

  @Column()
  difficulty: number;

  @ManyToOne(() => GameEntity, (GameEntity) => GameEntity.gameid, {
    eager: true,
  })
  @JoinColumn({ name: 'gameID' })
  game: GameEntity;

  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.id, {
    eager: true,
  })
  @JoinColumn({ name: 'userID' })
  user: UserEntity;

  constructor(partial: Partial<UserRecordEntity>) {
    Object.assign(this, partial);
  }
}
