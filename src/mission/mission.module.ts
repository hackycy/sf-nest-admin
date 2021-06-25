import { Global, Module } from '@nestjs/common';
import { AdminModule } from 'src/modules/admin/admin.module';
import { SysLogService } from 'src/modules/admin/system/log/log.service';
import { SysLogClearMissionService } from './services/sys-log-clear.service';
import { WeatherMissionService } from './services/weather.service';

const providers = [WeatherMissionService, SysLogClearMissionService];

/**
 * 所有需要执行的定时任务都需要在这里注册
 */
@Global()
@Module({
  imports: [AdminModule],
  providers: [...providers, SysLogService],
  exports: providers,
})
export class MissionModule {}
