import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiHeader } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getRoot(): string {
    return 'action-test-1-commit-2';
  }
}
