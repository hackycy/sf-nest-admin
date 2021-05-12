import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ROOT_ROLE_ID } from 'src/common/contants/admin.constants';
import SysDepartment from 'src/entities/admin/sys-department.entity';
import SysLoginLog from 'src/entities/admin/sys-login-log.entity';
import SysMenu from 'src/entities/admin/sys-menu.entity';
import SysReqLog from 'src/entities/admin/sys-req-log.entity';
import SysRoleDepartment from 'src/entities/admin/sys-role-department.entity';
import SysRoleMenu from 'src/entities/admin/sys-role-menu.entity';
import SysRole from 'src/entities/admin/sys-role.entity';
import SysTaskLog from 'src/entities/admin/sys-task-log.entity';
import SysTask from 'src/entities/admin/sys-task.entity';
import SysUserRole from 'src/entities/admin/sys-user-role.entity';
import SysUser from 'src/entities/admin/sys-user.entity';
import { rootRoleIdProvider } from '../core/provider/root-role-id.provider';
import { SysDeptController } from './dept/dept.controller';
import { SysDeptService } from './dept/dept.service';
import { SysLogController } from './log/log.controller';
import { SysLogService } from './log/log.service';
import { SysMenuController } from './menu/menu.controller';
import { SysMenuService } from './menu/menu.service';
import { SysRoleController } from './role/role.controller';
import { SysRoleService } from './role/role.service';
import { SysUserController } from './user/user.controller';
import { SysUserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SysUser,
      SysDepartment,
      SysUserRole,
      SysMenu,
      SysRoleMenu,
      SysRole,
      SysRoleDepartment,
      SysUserRole,
      SysLoginLog,
      SysReqLog,
      SysTask,
      SysTaskLog,
    ]),
  ],
  controllers: [
    SysUserController,
    SysRoleController,
    SysMenuController,
    SysDeptController,
    SysLogController,
  ],
  providers: [
    rootRoleIdProvider(),
    SysUserService,
    SysRoleService,
    SysMenuService,
    SysDeptService,
    SysLogService,
  ],
  exports: [ROOT_ROLE_ID, SysUserService, SysMenuService, SysLogService],
})
export class SystemModule {}
