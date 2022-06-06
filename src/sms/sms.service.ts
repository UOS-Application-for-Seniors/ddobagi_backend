import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class SmsService {
  constructor() {}

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

  async sendSMS(number: string, score: number): Promise<void> {
    // ACTUALL CODE
    const timestamp = Date.now().toString();
    const contentString =
      "[TEST MESSAGE ON DDOBAGI-BACKEND], Your Protege's CIST Score is " +
      score.toString();
    const body = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: '01033045027', // 발신자 번호
      content: contentString,
      messages: [
        {
          to: number, // 수신자 번호
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

    // TESTCODE

    // console.log(
    //   'Phone Number is ' + number + ', CIST SCORE IS ' + score.toString(),
    // );
  }

  async CISTDangerSMS(
    name: string,
    number: string,
    score: number,
    standard: number,
  ) {
    // ACTUALL CODE
    const timestamp = Date.now().toString();
    const contentString =
      '[또바기] 위험!' +
      name +
      '님이 금일 진행하신 간이 인지 선별 검사 결과, 피보호자분의 인지기능이 기준에 비해서 조금 낮게 나오셨습니다.\n' +
      name +
      '님이 이번 간이 인지 선별 검사 결과에서 얻은 점수는 ' +
      score.toString() +
      '점 이며, 검사 기준 점수는 ' +
      standard.toString() +
      '입니다.\n' +
      +'점수가 낮다고 해서 반드시 치매가 있는 것은 아니며 인지기능은 우울이나 건강상의 다양한 원인에 의해서 점수가 낮아질 수 있습니다. 먼저 또바기 놀이와 검사를 지속적으로 해보시고 그럼에도 점수가 계속 낮게 나온다면 기관을 방문하셔서 정밀검사를 받아 보시는 것을 추천드립니다.';
    const body = {
      type: 'LMS',
      contentType: 'COMM',
      countryCode: '82',
      from: '01033045027', // 발신자 번호
      content: contentString,
      messages: [
        {
          to: number, // 수신자 번호
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

    // TESTCODE

    // console.log(
    //   'Phone Number is ' + number + ', CIST SCORE IS ' + score.toString(),
    // );
  }
}
