import { UserRecordEntity } from 'src/users/entities/userRecord.entity';
import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm/index';

@Entity('Game')
export class GameEntity {
  @PrimaryColumn()
  gameid: number;
  @Column()
  gamename: string;
  @Column()
  usingfragment: string;
  @Column()
  field: string;
}
