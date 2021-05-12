import SysRoleDepartment from 'src/entities/admin/sys-role-department.entity';
import SysRoleMenu from 'src/entities/admin/sys-role-menu.entity';
import SysRole from 'src/entities/admin/sys-role.entity';

export class RoleInfo {
  roleInfo: SysRole;
  menus: SysRoleMenu[];
  depts: SysRoleDepartment[];
}

export class CreatedRoleId {
  roleId: number;
}
