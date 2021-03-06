import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
  IsDate,
  IsInt,
  Max,
} from 'class-validator';
import { Column } from 'typeorm';

export class GameDto {
  @ApiProperty({ description: '게임ID', example: '9' })
  @Type(() => Number)
  @IsNumber()
  gameid: number;

  @ApiProperty({ description: '게임이름', example: '야채' })
  @IsString()
  gamename: string;

  @ApiProperty({ description: '사용 프래그먼트', example: 'multipleChoice' })
  @IsString()
  usingfragment: string;

  @ApiProperty({ description: '분류', example: '지남력' })
  @IsString()
  field: string;

  @ApiProperty({ description: '퀴즈ID', example: '5' })
  @IsOptional()
  @IsNumber()
  quizid: number; // for Recommendation

  @ApiProperty({ description: '난이도', example: '1' })
  @IsOptional()
  @IsString()
  difficulty: string; // for Recommendation

  @ApiProperty({ description: '게임 설명', example: '간략한 게임 설명' })
  @IsOptional()
  gamedescript: string; // for GameList

  @ApiProperty({ description: '최대 난이도', example: '2' })
  @IsOptional()
  @IsNumber()
  openedDifficulty: number; // for GameList
}
