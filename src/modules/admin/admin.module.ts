import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { AccountModule } from './account/account.module';
import { AuthGuard } from './core/guards/auth.guard';
import { ReqLogInterceptor } from './core/interceptors/req-log.interceptor';
import { LoginModule } from './login/login.module';
import { NetdiskModule } from './netdisk/netdisk.module';
import { SystemModule } from './system/system.module';

/**
 * Admin模块，所有API都需要加入/admin前缀
 */
@Module({
  imports: [
    // register prefix
    RouterModule.register([
      {
        path: 'admin',
        children: [
          { path: '', module: LoginModule },
          { path: 'netdisk', module: NetdiskModule },
          { path: 'account', module: AccountModule },
          { path: 'sys', module: SystemModule },
        ],
      },
    ]),
    // component module
    LoginModule,
    SystemModule,
    AccountModule,
    NetdiskModule,
  ],
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
  exports: [SystemModule],
})
export class AdminModule {}
