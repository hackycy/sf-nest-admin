import { Global, Module } from '@nestjs/common';
import { WeatherMissionService } from './services/weather.service';

const providers = [WeatherMissionService];

/**
 * 所有需要执行的定时任务都需要在这里注册
 */
@Global()
@Module({
  providers,
  exports: providers,
})
export class MissionModule {}
