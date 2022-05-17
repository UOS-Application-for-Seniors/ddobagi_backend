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
import { exhaustMap } from 'rxjs';

export class LoginDto {
  @ApiProperty({ description: '아이디', example: 'test' })
  @IsString()
  readonly username: string;

  @ApiProperty({ description: '비밀번호', example: 'test' })
  @IsString()
  readonly password: string;
}
