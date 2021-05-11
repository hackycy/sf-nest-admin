import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_role_department' })
export default class SysRoleDepartment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'department_id' })
  departmentId: number;
}
