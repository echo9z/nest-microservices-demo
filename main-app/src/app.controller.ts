import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // 在 Controller 里注入这个微服务的 clientProxy，也就是客户端代理
    @Inject('CALC_SERVICE') private calcClient: ClientProxy,
    @Inject('LOG_SERVICE') private logClient: ClientProxy,
    @Inject('REDIS_SERVICE') private redisClient: ClientProxy,
    @Inject('AMQP_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  @Get()
  async getHello() {
    return await this.appService.getHello();
  }
  
  @Get('sum')
  calc(@Query('num') str): Observable<number> {
    const numArr = str.split(',').map((item) => parseInt(item));
    this.logClient.emit('log', 'sum function'+ numArr)
    return this.calcClient.send('sum', numArr);
  }

  @Get('redis')
  getNotifications(@Query('msg') str): Observable<any> {
    const numArr: [] = str.split(',').map((item) => parseInt(item));
    console.log(numArr);
    this.redisClient.send('set', { key: 'msg', value: numArr.toString()})
    return this.redisClient.send('notifications', numArr);
  }

  @Get('rabbit')
  rabbit(@Query('msg') str): string {
    this.rabbitClient.send('rabbitNot', str).subscribe();
    return 'ok'
  }
}
