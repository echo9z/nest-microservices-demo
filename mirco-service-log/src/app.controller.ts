import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // log 不需要响应，只是处理事件，所以不用 MessagePattern 注册消息了，用 EventPattern
  @EventPattern('log')
  log(text: string): void {
    console.log(text);
  }
}
