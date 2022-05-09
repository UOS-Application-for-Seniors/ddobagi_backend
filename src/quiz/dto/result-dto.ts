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

export class ResultDto {
  @Type(() => Number)
  @IsNumber()
  readonly score: number;

  @IsString()
  readonly gameID: string;
}
