import {
  HttpException,
  Injectable,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import axios from 'axios';

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
    return {
      access_token: this.jwtService.sign(payload),
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

  private makeSignature(timestamp: string): string {
    const uri = encodeURIComponent('ncp:sms:kr:284855416355:ddobagi');
    console.log(uri);
    const message = [];
    const hmac = crypto.createHmac(
      'sha256',
      'e6k71gxquU0f5InGEqPPcur58X4XNr8neK8m4Znn',
    );
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    message.push(method);
    message.push(space);
    message.push('/sms/v2/services/ncp:sms:kr:284855416355:ddobagi/messages');
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push('VrCjxGsF2m4MDshEdCjQ');
    //message 배열에 위의 내용들을 담아준 후에
    const signature = hmac.update(message.join('')).digest('base64');
    //message.join('') 으로 만들어진 string 을 hmac 에 담고, base64로 인코딩한다
    console.log(signature.toString());
    return signature.toString(); // toString()이 없었어서 에러가 자꾸 났었는데, 반드시 고쳐야함.
  }

  async sendSMS(): Promise<void> {
    const timestamp = Date.now().toString();
    const body = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: '01033045027', // 발신자 번호
      content: `Nest js SMS Service TEST`,
      messages: [
        {
          to: '01023698672', // 수신자 번호
        },
      ],
    };
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-iam-access-key': 'VrCjxGsF2m4MDshEdCjQ',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-apigw-signature-v2': this.makeSignature(timestamp),
      },
    };
    axios
      .post(
        'https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:284855416355:ddobagi/messages',
        body,
        options,
      )
      .then(async (res) => {
        console.log('good');
      })
      .catch((err) => {
        console.error(err.response.data);
        throw new InternalServerErrorException();
      });
  }
}
