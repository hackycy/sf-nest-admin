import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageResult } from 'src/common/class/res.class';
import { PageOptionsDto } from 'src/common/dto/page.dto';
import SysConfig from 'src/entities/admin/sys-config.entity';
import { SysParamConfigService } from './param-config.service';

@ApiTags('参数配置模块')
@Controller('param-config')
export class SysParamConfigController {
  constructor(private paramConfigService: SysParamConfigService) {}

  @ApiOperation({ summary: '查询当前在线用户' })
  @ApiOkResponse({ type: [SysConfig] })
  @Get('page')
  async page(@Query() dto: PageOptionsDto): Promise<PageResult<SysConfig>> {
    const list = await this.paramConfigService.getConfigListByPage(
      dto.page - 1,
      dto.limit,
    );
    const count = await this.paramConfigService.countConfigList();
    return {
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
      list,
    };
  }
}
