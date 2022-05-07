import {
  SetMetadata,
  Controller,
  Get,
  Req,
  Post,
  Request,
  UseGuards,
  Res,
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
  async register(@Request() req) {
    await this.authService.register(req);
    return Object.assign({ result: 'OK' });
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@Request() req) {
    return this.authService.authLogin(req.user);
  }

  @Get('/auth/profile')
  getProfile2(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Request() req) {
    return this.authService.makeAccessToken(
      req.user.id,
      req.user.email,
      req.user.name,
    );
  }

  @Get('/quiz/games')
  async getGames(@Request() req) {
    const userData = await this.userService.getUserData(req.user.id);
    const dto = new UserDataDto(userData);

    return this.quizService.getRecommendation(dto);
  }
}
