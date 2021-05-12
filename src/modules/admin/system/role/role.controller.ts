import { Get, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ADMIN_PREFIX } from 'src/common/contants/admin.constants';
import { PageOptionsDto } from 'src/common/dto/page.dto';
import { PageResult } from 'src/common/class/res.class';
import SysRole from 'src/entities/admin/sys-role.entity';
import { AdminController } from '../../core/decorators/admin-controller.decorator';
import { SysRoleService } from './role.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('角色模块')
@AdminController('sys/role')
export class SysRoleController {
  constructor(private roleService: SysRoleService) {}

  @ApiOperation({
    summary: '获取角色列表',
  })
  @Get('list')
  async list(): Promise<SysRole[]> {
    return await this.roleService.list();
  }

  @ApiOperation({
    summary: '分页查询角色信息',
  })
  @Get('page')
  async page(@Query() dto: PageOptionsDto): Promise<PageResult<SysRole>> {
    const list = await this.roleService.page(dto.page - 1, dto.limit);
    const count = await this.roleService.count();
    return {
      list,
      pagination: {
        size: dto.limit,
        page: dto.page,
        total: count,
      },
    };
  }
}
