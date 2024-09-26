import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 0 */12 * * *')
  handleCron() {
    this.logger.debug('Called twice per day');
  }

}
