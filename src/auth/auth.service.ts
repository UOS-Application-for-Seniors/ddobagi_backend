import {
  HttpException,
  Injectable,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { jwtRefreshConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userID: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(userID);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async authLogin(user: any) {
    const payload = { username: user.id, email: user.email, name: user.name };
    const tmp_access = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '180s',
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: 'secret',
      expiresIn: '36000s',
    });
    this.usersService.updateUserRefreshToken(user.id, refresh_token);

    return {
      access_token: tmp_access,
      access_token_expiration: '1800000',
      refresh_token: refresh_token,
      refresh_token_expiration: '36000000',
      user_address: await this.usersService.getAddress(user.id),
    };
  }

  makeAccessToken(userid: string, email: string, name: string) {
    const payload = { username: userid, email: email, name: name };
    const tmp_access = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '180s',
    });

    return {
      access_token: tmp_access,
      access_token_expiration: '1800000',
    };
  }

  async register(user: any): Promise<void> {
    const payload = await this.usersService.checkExist(user.body.id);
    if (payload) {
      throw new HttpException('Duplicated UserID', HttpStatus.BAD_REQUEST);
    } else {
      await this.usersService.saveUser(user.body);
    }
  }

  async getProfile(userid: string) {
    const data = await this.usersService.getProfile(userid);
    return data;
  }
}
