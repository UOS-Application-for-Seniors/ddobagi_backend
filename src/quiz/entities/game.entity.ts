import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '게임 번호', example: '9' })
  @PrimaryColumn()
  gameid: number;

  @ApiProperty({ description: '게임 이름', example: '야채' })
  @Column()
  gamename: string;

  @ApiProperty({ description: '사용 프래그먼트', example: 'multipleChoice' })
  @Column()
  usingfragment: string;

  @ApiProperty({
    description: '간략한 설명',
    example: '야채가 아닌것을 고르는 게임',
  })
  @Column()
  gamedescript: string;

  @ApiProperty({ description: '분류', example: '인지력' })
  @Column()
  field: string;
}
