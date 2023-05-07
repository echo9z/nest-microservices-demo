import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbit:wzh123@localhost:5672'],
        queue: 'cats_queue', // 队列名称
        noAck: false, // 请将noAck属性设置为false： 当手动消费者确认打开时，我们必须向工人发送适当的确认 channel.ack(originalMsg);
        queueOptions: {
          durable: false // 消息是否持久化
        },
      },
    }
  );
  await app.listen();
}
bootstrap();
