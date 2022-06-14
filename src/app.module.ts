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
import { BatchModule } from './batch/batch.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      username: 'b9d117d8a56270',
      password: '4913483b',
      port: 3306,
      host: 'us-cdbr-east-05.cleardb.net',
      database: 'heroku_73d80cf2120dd68',
      synchronize: false,
    }),
    AuthModule,
    FileModule,
    QuizModule,
    BatchModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
