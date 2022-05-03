import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TaskService {
  constructor(private readonly userService: UsersService) {}

  private readonly logger = new Logger(TaskService.name);

  @Cron('*/5 * * * * *', { name: 'cronTask' })
  async handleCron() {
    const date = new Date();
    // date.setTime(Date.now());
    // this.logger.log(date.toJSON().substring(0, 10)); expected output "2022-05-03"
    console.log(
      await this.userService.checkDate(date.toJSON().substring(0, 10)),
    );
  }
}
