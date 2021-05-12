import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SysDepartment from 'src/entities/admin/sys-department.entity';
import SysMenu from 'src/entities/admin/sys-menu.entity';
import SysRoleDepartment from 'src/entities/admin/sys-role-department.entity';
import SysRoleMenu from 'src/entities/admin/sys-role-menu.entity';
import SysRole from 'src/entities/admin/sys-role.entity';
import SysUserRole from 'src/entities/admin/sys-user-role.entity';
import SysUser from 'src/entities/admin/sys-user.entity';
import { SysDeptController } from './dept/dept.controller';
import { SysDeptService } from './dept/dept.service';
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
    ]),
  ],
  controllers: [
    SysUserController,
    SysRoleController,
    SysMenuController,
    SysDeptController,
  ],
  providers: [SysUserService, SysRoleService, SysMenuService, SysDeptService],
  exports: [SysUserService, SysMenuService],
})
export class SystemModule {}
