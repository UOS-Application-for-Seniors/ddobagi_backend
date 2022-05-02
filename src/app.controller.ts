import { Controller, Get, Req, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local.auth-guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Post('/auth/register')
  async register(@Request() req) {
    return this.authService.register(req);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@Request() req) {
    return this.authService.authLogin(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth/profile')
  getProfile2(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Get('/SMS')
  async sendSMS() {
    return this.authService.sendSMS();
  }
}
