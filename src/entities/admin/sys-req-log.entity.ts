import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_req_log' })
export default class SysReqLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @Column({ type: 'text', nullable: true })
  params: string;

  @Column({ length: 100, nullable: true })
  action: string;

  @Column({ length: 15, nullable: true })
  method: string;

  @Column({ type: 'int', nullable: true })
  status: number;

  @Column({ type: 'int', nullable: true, name: 'consume_time', default: 0 })
  consumeTime: number;
}
