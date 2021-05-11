import { Get } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ADMIN_PREFIX } from 'src/common/contants/admin.constants';
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
}
