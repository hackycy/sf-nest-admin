import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisProvider } from 'src/common/providers/redis.provider';
import SysDepartment from 'src/entities/admin/sys-department.entity';
import SysMenu from 'src/entities/admin/sys-menu.entity';
import SysRoleDepartment from 'src/entities/admin/sys-role-department.entity';
import SysRoleMenu from 'src/entities/admin/sys-role-menu.entity';
import SysRole from 'src/entities/admin/sys-role.entity';
import SysUserRole from 'src/entities/admin/sys-user-role.entity';
import SysUser from 'src/entities/admin/sys-user.entity';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { SysMenuService } from './sys-menu/sys-menu.service';
import { SysRoleService } from './sys-role/sys-role.service';
import { SysUserController } from './sys-user/sys-user.controller';
import { SysUserService } from './sys-user/sys-user.service';

/**
 * Admin模块，所有API都需要加入/admin前缀
 */
@Module({})
export class AdminModule {
  static register(): DynamicModule {
    return {
      module: AdminModule,
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
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        redisProvider(),
        LoginService,
        SysUserService,
        SysMenuService,
        SysRoleService,
      ],
      controllers: [LoginController, SysUserController],
    };
  }
}
