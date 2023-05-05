import { Body, Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx,MessagePattern, EventPattern, Payload, RedisContext } from '@nestjs/microservices';

@Controller()
export class AppController {
    // 注入redis服务
  constructor(private readonly redisClientService: AppService) {}

  @MessagePattern('get')
  async get(@Payload() payload) {
    return await this.redisClientService.get(payload.key);
  }

  @EventPattern('set')
  async set(@Payload() payload) {
    console.log(payload);
    const { key, ...value } = payload as any;
    return await this.redisClientService.set(key, value, 10); // 10s缓存redis
  }

  @EventPattern('del')
  async del(@Payload() payload) {
    return await this.redisClientService.del(payload.key);
  }

  @EventPattern('delAll')
  async delAll() {
    return await this.redisClientService.flushall();
  }


  // 访问有关传入请求的更多信息。当使用Redis传输器时，你可以访问redisContext对象。
  @EventPattern('notifications')
  getNotifications(@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(data, context);
    console.log(`Channel: ${context.getChannel()}`);
    // context.setChannel()
    return 'ok'
  }
}
