import { Body, Controller, Get, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Controller('/check')
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post()
  async getHashedPassword(@Body() data: { password: string }): Promise<string> {
    return await bcrypt.hash(data.password, 10);
  }
}
