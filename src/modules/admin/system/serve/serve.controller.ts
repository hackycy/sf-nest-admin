import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ADMIN_PREFIX } from '../../admin.constants';
import { ServeStatInfo } from './serve.class';
import { SysServeService } from './serve.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('服务监控')
@Controller('serve')
export class SysServeController {
  constructor(private serveService: SysServeService) {}

  @ApiOperation({ summary: '获取服务器运行信息' })
  @ApiOkResponse({ type: ServeStatInfo })
  @Get('stat')
  async stat(): Promise<ServeStatInfo> {
    return {};
  }
}
