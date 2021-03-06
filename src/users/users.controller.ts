import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { ReturnObject, UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from './dto/create-register';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
@ApiTags('User API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('check')
  @ApiOperation({
    summary: '유저 존재 여부 확인',
    description: '동일한 유저명을 가진 유저의 수를 파악합니다.',
  })
  @ApiCreatedResponse({ description: '유저 확인', type: Number })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string' },
      },
    },
  })
  checkExist(@Request() body) {
    return this.usersService.checkExist(body.body.username);
  }

  @Get('getUserResult')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '유저 게임 기록 출력',
    description: '유저의 게임 정답률과 현재 별 획득 갯수를 확인합니다',
  })
  @ApiCreatedResponse({ description: '결과', type: ReturnObject })
  async getUserResult(@Request() req) {
    return this.usersService.getUserResult(req.user.id);
  }

  @Post('saveGameResult')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '유저 게임 기록 저장',
    description: '유저의 게임 결과를 저장합니다.',
  })
  @ApiBody({
    schema: {
      properties: {
        gameID: { type: 'string' },
        score: { type: 'string' },
        difficulty: { type: 'string' },
        coin: { type: 'string' },
      },
    },
  })
  saveGameResult(@Request() req, @Body() body) {
    return this.usersService.saveGameResult(
      req.user.id,
      body.gameID,
      body.score,
      body.difficulty,
      body.coin,
    );
  }

  @Post('update')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '유저 정보 업데이트',
    description: '유저의 정보를 업데이트합니다',
  })
  @ApiBody({ type: UpdateUserDto })
  updateUserData(@Request() req, @Body() updateUser: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, updateUser);
  }

  @Post('userAddCoin')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '유저 코인 추가',
    description: '유저의 코인을 추가합니다',
  })
  @ApiBody({
    schema: {
      properties: {
        coin: { type: 'string' },
      },
    },
  })
  async userAddCoin(@Request() req, @Body() body) {
    await this.usersService.addCoin(req.user.id, body.coin);
  }
}
