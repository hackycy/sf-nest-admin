import { CacheModule, DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-ioredis';
import { redisProvider } from 'src/common/providers/redis.provider';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';

/**
 * Admin模块，所有API都需要加入/admin前缀
 */
@Module({})
export class AdminModule {
  static register(): DynamicModule {
    return {
      module: AdminModule,
      imports: [
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
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('jwt.secret'),
            signOptions: { expiresIn: '60s' },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        redisProvider(),
        LoginService,
      ],
      controllers: [LoginController],
    };
  }
}
