import { Transport } from "@nestjs/microservices";

export default () => ({
  redisService: {
    options: {
      port: process.env.REDIS_SERVICE_PORT,
      host: process.env.REDIS_SERVICE_HOST,
    },
    transport: Transport.REDIS,
  },
  redis: {
    config: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      // db: 0,
      password: process.env.REDIS_PASS || '',
      keyPrefix: process.env.REDIS_KEY_PREFIX || '',
      onClientCreated(client) {
        try {
          client.on('error', (err) => {
            console.log(err);
          });
          client.on('ready', () => {
            // console.log('redis to ready');
          });
        } catch (error) {
          
        }
      },
    },
  }
});