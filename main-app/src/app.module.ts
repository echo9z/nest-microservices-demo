import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局导入
      cache: true,
      envFilePath: '.env', // 会读取根文件下 .env文件 `${process.env.NODE_ENV}.env`
      load: [configuration], // 读取的是自定义配置文件 configuration.ts 数据配置文件
    }),
    ClientsModule.register([
      // 将calc微服务注册到 web服务中
      {
        name: 'CALC_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 18080
        }
      },
      // 将log微服务注册到 web服务中
      {
        name: 'LOG_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 18081
        }
      },
    ])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 从其他服务（例如ConfigService）获取传输器配置
    {
      provide: 'REDIS_SERVICE',
      useFactory: (configService: ConfigService) => {
        const redisSvcOptions = configService.get('redisService');
        return ClientProxyFactory.create(redisSvcOptions);
      },
      inject: [ConfigService],
    }
  ],
})
export class AppModule {}
