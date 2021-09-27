import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SysConfig from 'src/entities/admin/sys-config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SysParamConfigService {
  constructor(
    @InjectRepository(SysConfig)
    private configRepository: Repository<SysConfig>,
  ) {}

  /**
   * 罗列所有配置
   */
  async getConfigListByPage(page: number, count: number): Promise<SysConfig[]> {
    return this.configRepository.find({
      order: {
        id: 'ASC',
      },
      take: count,
      skip: page * count,
    });
  }

  /**
   * 获取参数总数
   */
  async countConfigList(): Promise<number> {
    return this.configRepository.count();
  }
}
