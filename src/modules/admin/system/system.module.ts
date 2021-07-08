import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ROOT_ROLE_ID,
  SYS_TASK_QUEUE_NAME,
  SYS_TASK_QUEUE_PREFIX,
} from 'src/modules/admin/admin.constants';
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
import { BullModule } from '@nestjs/bull';
import { SysTaskController } from './task/task.controller';
import { SysTaskService } from './task/task.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SysTaskConsumer } from './task/task.processor';
import { SysOnlineController } from './online/online.controller';
import { SysOnlineService } from './online/online.service';

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
    BullModule.registerQueueAsync({
      name: SYS_TASK_QUEUE_NAME,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
          db: configService.get<number>('redis.db'),
        },
        prefix: SYS_TASK_QUEUE_PREFIX,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    SysUserController,
    SysRoleController,
    SysMenuController,
    SysDeptController,
    SysLogController,
    SysTaskController,
    SysOnlineController,
  ],
  providers: [
    rootRoleIdProvider(),
    SysUserService,
    SysRoleService,
    SysMenuService,
    SysDeptService,
    SysLogService,
    SysTaskService,
    SysTaskConsumer,
    SysOnlineService,
  ],
  exports: [
    ROOT_ROLE_ID,
    TypeOrmModule,
    SysUserService,
    SysMenuService,
    SysLogService,
  ],
})
export class SystemModule {}
