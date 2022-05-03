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

export class RegisterUserDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @Type(() => Number)
  @IsNumber()
  @Max(11)
  readonly userEducationLevel: number;

  @IsString()
  readonly userBirthDate: string;

  @IsString()
  readonly Address: string;

  @IsString()
  readonly PhoneNumber: string;

  @IsOptional()
  @IsString()
  readonly NOKID: string;

  @IsOptional()
  @IsString()
  readonly NOKName: string;

  @IsOptional()
  @IsString()
  readonly NOKPhoneNumber: string;

  @IsOptional()
  @IsInt()
  readonly NOKNotificationDays: number;
}
