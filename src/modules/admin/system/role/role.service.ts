import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SysRoleDepartment from 'src/entities/admin/sys-role-department.entity';
import SysRoleMenu from 'src/entities/admin/sys-role-menu.entity';
import SysRole from 'src/entities/admin/sys-role.entity';
import SysUserRole from 'src/entities/admin/sys-user-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SysRoleService {
  constructor(
    @InjectRepository(SysRole) private sysRoleRepository: Repository<SysRole>,
    @InjectRepository(SysRoleMenu)
    private sysRoleMenuRepository: Repository<SysRoleMenu>,
    @InjectRepository(SysRoleDepartment)
    private sysRoleDepartmentRepository: Repository<SysRoleDepartment>,
    @InjectRepository(SysUserRole)
    private sysUserRoleRepository: Repository<SysUserRole>,
  ) {}
}
