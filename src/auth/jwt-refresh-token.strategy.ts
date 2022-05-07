import { ExtractJwt, Strategy } from 'passport-jwt';
import { Req, UnauthorizedException } from '@nestjs/common';
import { request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { jwtRefreshConstants } from './constants';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { startWith } from 'rxjs';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    console.log('hello');
    const header = req.headers.authorization;
    console.log(header);
    const jwt = header.substring(7, header.length);

    const user = await this.usersRepository.findOne({ userRefreshToken: jwt });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { email: payload.email, id: payload.username, name: payload.name };
  }
}
