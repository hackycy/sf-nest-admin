import { Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ADMIN_PREFIX } from '../../admin.constants';
import { AdminController } from '../../core/decorators/admin-controller.decorator';
import { PermissionOptional } from '../../core/decorators/permission-optional.decorator';
import { OverviewSpaceInfo } from './overview.class';
import { NetDiskOverviewService } from './overview.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('网盘概览模块')
@AdminController('netdisk/overview')
export class NetDiskOverviewController {
  constructor(private overviewService: NetDiskOverviewService) {}

  @ApiOperation({ summary: '获取存储空间数量' })
  @ApiOkResponse({ type: OverviewSpaceInfo })
  @PermissionOptional()
  @Get('desc')
  async space(): Promise<OverviewSpaceInfo> {
    const date = this.overviewService.getZeroHourToDay(new Date());
    const hit = await this.overviewService.getHit(date);
    const flow = await this.overviewService.getFlow(date);
    const space = await this.overviewService.getSpace(date);
    const count = await this.overviewService.getCount(date);
    return {
      fileSize: count.datas[0],
      flowSize: flow.datas[0],
      hitSize: hit.datas[0],
      spaceSize: space.datas[0],
    };
  }
}
