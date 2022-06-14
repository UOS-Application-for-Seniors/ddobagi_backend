<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">또바기 어플리케이션을 위한 Nest를 이용한 REST API 서버입니다.
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


## You can test this on Heroku!

- 또바기 백엔드 API 서버는 현재 Heroku에서 Deploy 되고 있습니다.
- 하단 주소를 통해 또바기 백엔드 API 서버의 엔드포인트에 대한 설명을 볼 수 있습니다.
- https://ddobagi-backend.herokuapp.com/api-docs/

## Installation

```bash
$ npm install
```

## Before Use
- 실행 전, MySQL 서버와 Nest.js간 연동이 필요합니다.
```typescript
// app.module.ts
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      username: 'YOUR_MYSQL_USERNAME_HERE',
      password: 'YOUR_MYSQL_PASSWORD_HERE',
      port: 3306,
      host: 'YOUR_MYSQL_HOSTNAME_HERE',
      database: 'YOUR_MYSQL_DATABASENAME_HERE',
      synchronize: true,
    }),
    AuthModule,
    FileModule,
    QuizModule,
    BatchModule,
    SmsModule,
  ],
```
- SMS 서비스를 시연하기 위해서는 네이버 클라우드 서비스에 가입하고, SMS.service.ts 를 수정해야합니다.

- 동물 이름 DB의 경우 국립국어원 표준국어대사전을 이용하여 구상하였습니다, 다만 해당 DB의 저작권을 위해 Github에 추가하진 않았습니다. 필요시 MySQL상 animal 테이블에 자체적으로 추가해야합니다.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```



## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- 개발 : 진수민 (서울시립대학교 컴퓨터과학부 2017920061 / contact : him7509@gmail.com)
- Deployed on : https://ddobagi-backend.herokuapp.com/

## License

Nest is [MIT licensed](LICENSE).
