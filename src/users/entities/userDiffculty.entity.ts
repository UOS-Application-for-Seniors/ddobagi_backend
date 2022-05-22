import { GameEntity } from 'src/quiz/entities/game.entity';
import internal from 'stream';
import {
  Column,
  Entity,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRecordEntity } from './userRecord.entity';

@Entity('UserDifficulty')
export class UserDifficultyEntity {
  @Column()
  difficulty: number;

  @ManyToOne(() => GameEntity, (GameEntity) => GameEntity.gameid, {
    eager: true,
    primary: true,
  })
  @JoinColumn({ name: 'gameID' })
  game: GameEntity;

  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.id, {
    eager: true,
    primary: true,
  })
  @JoinColumn({ name: 'userID' })
  user: UserEntity;

  constructor(partial: Partial<UserDifficultyEntity>) {
    Object.assign(this, partial);
  }
}
