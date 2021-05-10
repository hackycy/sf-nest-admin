import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../base';

@Entity({ name: 'sys_menu' })
export default class SysMenu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  router: string;

  @Column({ nullable: true })
  perms: string;

  @Column({ type: 'tinyint', default: 0 })
  type: number;

  @Column({ nullable: true })
  icon: string;

  @Column({ name: 'order_num', type: 'int', default: 0, nullable: true })
  orderNum: number;

  @Column({ name: 'view_path', nullable: true })
  viewPath: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  keepalive: boolean;

  @Column({ type: 'boolean', nullable: true, default: true })
  isShow: boolean;
}
