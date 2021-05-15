import { Module } from '@nestjs/common';
import { qiniuProvider } from '../core/provider/qiniu.provider';
import { SystemModule } from '../system/system.module';
import { NetDiskManageController } from './manager/manage.controller';
import { NetDiskManageService } from './manager/manage.service';

@Module({
  imports: [SystemModule],
  controllers: [NetDiskManageController],
  providers: [NetDiskManageService, qiniuProvider()],
})
export class NetdiskModule {}
