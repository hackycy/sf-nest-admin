import { Injectable } from '@nestjs/common';
import { SysLogService } from 'src/modules/admin/system/log/log.service';
import { Mission } from '../mission.decorator';

/**
 * 管理后台日志清理任务
 */
@Injectable()
@Mission()
export class SysLogClearMissionService {
  constructor(private sysLogService: SysLogService) {}

  async clearReqLog(): Promise<void> {
    await this.sysLogService.clearReqLog();
  }

  async clearLoginLog(): Promise<void> {
    await this.sysLogService.clearLoginLog();
  }

  async clearTaskLog(): Promise<void> {
    await this.sysLogService.clearTaskLog();
  }
}
