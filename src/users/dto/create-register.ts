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

export class RegisterUserDto {
  @ApiProperty({ description: '아이디', example: 'test' })
  @IsString()
  readonly id: string;

  @ApiProperty({ description: '이름', example: '홍길동' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: '비밀번호', example: '1234asdf' })
  @IsString()
  readonly password: string;

  @ApiProperty({ description: '최종학력', example: 4 })
  @Type(() => Number)
  @IsNumber()
  @Max(11)
  readonly userEducationLevel: number;

  @ApiProperty({ description: '생년월일', example: '1998-11-07' })
  @IsString()
  readonly userBirthDate: string;

  @ApiProperty({ description: '주소', example: '의정부시,신곡동' })
  @IsString()
  readonly Address: string;

  @ApiProperty({ description: '보호자 ID (자동생성)' })
  @IsOptional()
  @IsString()
  readonly NOKID: string;

  @ApiProperty({ description: '보호자 성명', example: '김경민' })
  @IsOptional()
  @IsString()
  readonly NOKName: string;

  @ApiProperty({
    description: '보호자 휴대전화 번호',
    example: '010-xxxx-xxxx',
  })
  @IsOptional()
  @IsString()
  readonly NOKPhoneNumber: string;

  @ApiProperty({ description: '보호자 알림 주기', example: 14 })
  @IsOptional()
  @IsInt()
  readonly NOKNotificationDays: number;
}
