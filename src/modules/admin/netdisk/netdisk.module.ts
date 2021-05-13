import { Module } from '@nestjs/common';
import { qiniuProvider } from '../core/provider/qiniu.provider';
import { NetDiskManageController } from './manager/manage.controller';
import { NetDiskManageService } from './manager/manage.service';

@Module({
  controllers: [NetDiskManageController],
  providers: [NetDiskManageService, qiniuProvider()],
})
export class NetdiskModule {}
