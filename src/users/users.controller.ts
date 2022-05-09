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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from './dto/create-register';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async register(@Body() userData: RegisterUserDto): Promise<void> {
    await this.usersService.saveUser(userData);
  }

  @Public()
  @Post('check')
  checkExist(@Request() body) {
    return this.usersService.checkExist(body.body.username);
  }

  @Get('getUserResult')
  async getUserResult(@Request() req) {
    console.log(req);
    return this.usersService.getUserResult(req.user.id);
  }

  @Post('saveGameResult')
  saveGameResult(@Request() req, @Body() body) {
    return this.usersService.saveGameResult(
      req.user.id,
      body.gameid,
      body.score,
      body.difficulty,
    );
  }
}
