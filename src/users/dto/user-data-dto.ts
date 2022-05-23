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
import { UserDataEntity } from '../entities/userData.entity';

export class UserDataDto {
  @IsNumber()
  readonly field1: number;

  @IsNumber()
  readonly field2: number;

  @IsNumber()
  readonly field3: number;

  @IsNumber()
  readonly field4: number;

  @IsNumber()
  readonly field5: number;

  @IsNumber()
  readonly field6: number;

  constructor(user: UserDataEntity) {
    this.field1 = user.field1;
    this.field2 = user.field2;
    this.field3 = user.field3;
    this.field4 = user.field4;
    this.field5 = user.field5;
    this.field6 = user.field6;
  }
}
