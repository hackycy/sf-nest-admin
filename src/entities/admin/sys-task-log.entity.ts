import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { BaseEntity } from '../base';

@Entity({ name: 'sys_task_log' })
export default class SysTaskLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'task_id' })
  taskId: number;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ type: 'int', nullable: true, name: 'consume_time', default: 0 })
  consumeTime: number;
}
