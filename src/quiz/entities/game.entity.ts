import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm/index';

@Entity('Game')
export class GameEntity {
  @PrimaryGeneratedColumn('rowid')
  gameid: number;
  @Column()
  gamename: string;
  @Column()
  usingfragment: string;
  @Column()
  field: string;
}
