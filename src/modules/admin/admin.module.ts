import { CacheModule, DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import { redisProvider } from 'src/common/providers/redis.provider';
import SysDepartment from 'src/entities/admin/sys-department.entity';
import SysMenu from 'src/entities/admin/sys-menu.entity';
import SysRoleMenu from 'src/entities/admin/sys-role-menu.entity';
import SysUserRole from 'src/entities/admin/sys-user-role.entity';
import SysUser from 'src/entities/admin/sys-user.entity';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { SysMenuService } from './sys-menu/sys-menu.service';
import { SysUserController } from './sys-user/sys-user.controller';
import { SysUserService } from './sys-user/sys-user.service';

/**
 * Admin模块，所有API都需要加入/admin前缀
 */
@Module({})
export class AdminModule {
  static register(): DynamicModule {
    return {
      module: AdminModule,
      imports: [
        TypeOrmModule.forFeature([
          SysUser,
          SysDepartment,
          SysUserRole,
          SysMenu,
          SysRoleMenu,
        ]),
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
        SysUserService,
        SysMenuService,
      ],
      controllers: [LoginController, SysUserController],
    };
  }
}
