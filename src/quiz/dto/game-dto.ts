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
  @Type(() => Number)
  @IsNumber()
  readonly gameid: number;

  @IsString()
  readonly gamename: string;

  @IsString()
  readonly usingfragment: string;

  @IsString()
  readonly field: string;

  @IsOptional()
  @IsNumber()
  quizid: number; // for Recommendation

  @IsOptional()
  @IsString()
  difficulty: string; // for Recommendation
}
