import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from 'src/users/users.module';
import { TaskService } from './task.service';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule],
  providers: [TaskService],
})
export class BatchModule {}
