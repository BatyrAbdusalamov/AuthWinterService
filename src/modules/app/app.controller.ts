import { Controller, Get } from '@nestjs/common';

@Controller('/check')
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
