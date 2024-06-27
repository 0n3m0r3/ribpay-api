import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiHeader } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getRoot(): string {
    console.log('The new API running, yeah!');
    return 'The new API running, yeah!';
  }
}
