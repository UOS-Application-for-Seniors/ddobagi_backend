import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './common/file/file.module';
import { ConfigModule } from '@nestjs/config';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';
import { QuizModule } from './quiz/quiz.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      //host: process.env.DATABASE_HOST,
      port: 3306,
      //username: process.env.DATABASE_USERNAME,
      //password: process.env.DATABASE_PASSWORD,
      //database: 'heroku_73d80cf2120dd68',
      host: 'localhost',
      username: 'root',
      password: 'Wlstnals07_',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    AuthModule,
    FileModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //{
    //  provide: APP_GUARD,
    //  useClass: JwtAuthGuard,
    //},
  ],
})
export class AppModule {}
