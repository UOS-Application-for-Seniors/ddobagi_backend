import {
  SetMetadata,
  Controller,
  Get,
  Req,
  Post,
  Request,
  UseGuards,
  Res,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local.auth-guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard, Public } from './auth/jwt-auth.guard';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';
import { UsersService } from './users/users.service';
import { UserDataDto } from './users/dto/user-data-dto';
import { JwtRefreshGuard } from './auth/jwt-refresh-token-auth.guard';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserDto } from './users/dto/create-register';
import { LoginDto } from './users/dto/sign-in-dto';
import { GameEntity } from './quiz/entities/game.entity';
import { GameDto } from './quiz/dto/game-dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private quizService: QuizService,
    private userService: UsersService,
  ) {}

  @Public()
  @Post('/auth/register')
  @ApiTags('Auth')
  @ApiOperation({
    summary: '유저 회원가입',
    description: '유저의 회원가입 API입니다.',
  })
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() req: RegisterUserDto) {
    await this.authService.register(req);
    return Object.assign({ result: 'OK' });
  }

  @Public()
  @Post('/auth/login')
  @UseGuards(LocalAuthGuard)
  @ApiTags('Auth')
  @ApiOperation({
    summary: '유저 로그인',
    description: '유저의 로그인 API입니다.',
  })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.authLogin(loginDto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @ApiTags('Auth')
  @ApiBearerAuth('refresh-token')
  @ApiOperation({
    summary: 'Refresh Token 이용한 Access Token 발급',
    description: 'Refresh Token을 이용하여 Access Token을 새로 발급받습니다.',
  })
  @Get('refresh')
  refresh(@Request() req) {
    return this.authService.makeAccessToken(
      req.user.id,
      req.user.email,
      req.user.name,
    );
  }

  @ApiTags('Quiz')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '게임 추천받기',
    description: '유저 정보를 이용하여 게임 추천을 받습니다.',
  })
  @ApiCreatedResponse({ type: GameDto })
  @Get('/quiz/games')
  async getGames(@Request() req) {
    const userData = await this.userService.getUserData(req.user.id);
    const dto = new UserDataDto(userData);

    return this.quizService.getRecommendation(dto);
  }
}
