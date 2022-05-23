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

export class NOKDTO {
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
    example: '010xxxxxxxx',
  })
  @IsOptional()
  @IsString()
  readonly NOKPhoneNumber: string;

  @ApiProperty({ description: '보호자 알림 주기', example: 14 })
  @IsOptional()
  @IsInt()
  readonly NOKNotificationDays: number;
}
