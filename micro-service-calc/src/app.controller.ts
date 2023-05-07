import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('REDIS_SERVICE') private redisClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 这个sum 方法就是接收 sum消息
  @MessagePattern('sum')
  sum(numArr: Array<number>): number {
    console.log(numArr);
    // 调用redis中的微服务
    this.redisClient.emit('set', { key: 'sum', value: numArr });
    return numArr.reduce((total, item) => total + item, 0);
  }
}
