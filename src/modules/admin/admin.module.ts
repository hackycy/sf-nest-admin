import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccountModule } from './account/account.module';
import { AuthGuard } from './core/guards/auth.guard';
import { ReqLogInterceptor } from './core/interceptors/req-log.interceptor';
import { LoginModule } from './login/login.module';
import { SystemModule } from './system/system.module';

/**
 * Admin模块，所有API都需要加入/admin前缀
 */
@Module({})
export class AdminModule {
  static register(): DynamicModule {
    return {
      module: AdminModule,
      imports: [LoginModule, SystemModule, AccountModule],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ReqLogInterceptor,
        },
      ],
    };
  }
}
