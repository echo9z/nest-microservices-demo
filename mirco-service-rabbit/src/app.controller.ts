import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('rabbitNot')
  rabbitNot(@Payload() data: number[], @Ctx() context: RmqContext) {
    console.log(data, context.getMessage().content.toString());
    // 消费rabbit中数据
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    // setInterval(() => {
    // }, 1000)
  }
}
