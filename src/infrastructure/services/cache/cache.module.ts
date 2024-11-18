import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import { ICacheService } from './cache.interface';
import { CacheService } from './cache.service';
import { EnvironmentConfigService } from '@config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory(configService: EnvironmentConfigService) {
        const redisConfig: RedisOptions = {
          port: configService.getRedisPort(),
          host: configService.getRedisHost(),
          keyPrefix: configService.getRedisPrefix(),
        };

        const redisPassword = configService.getRedisPassword();
        if (redisPassword) {
          redisConfig.password = redisPassword;
        }

        return new Redis(redisConfig);
      },
      inject: [ConfigService],
    },
    {
      provide: ICacheService,
      useClass: CacheService,
    },
  ],
  exports: [ICacheService],
})
export class CacheModule {}
