import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_login_log' })
export default class SysLoginLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @Column({ nullable: true })
  ip: string;

  @Column({ type: 'datetime', nullable: true })
  time: Date;

  @Column({ length: 500, nullable: true })
  ua: string;
}
