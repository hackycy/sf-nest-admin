import { Global, HttpModule, CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-ioredis';
import { REDIS_INSTANCE } from 'src/common/contants/common.contants';
import { redisProvider } from 'src/common/providers/redis.provider';
import { UtilService } from './services/util.service';

const providers = [UtilService];

/**
 * 全局共享模块
 */
@Global()
@Module({
  imports: [
    HttpModule,
    // redis cache
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
        password: configService.get<string>('redis.password'),
        db: configService.get<number>('redis.db'),
        ttl: configService.get<number>('redis.ttl'),
      }),
      inject: [ConfigService],
    }),
    // jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...providers, redisProvider()],
  exports: [...providers, HttpModule, CacheModule, JwtModule, REDIS_INSTANCE],
})
export class SharedModule {}
