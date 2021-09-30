import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';

@Injectable()
export class SysServeService {
  /**
   * 获取服务器信息
   */
  async getServeStat(): Promise<void> {
    await si.cpu();
  }
}
