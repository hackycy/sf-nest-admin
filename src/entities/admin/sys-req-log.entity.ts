import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_req_log' })
export default class SysReqLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ nullable: true })
  @ApiProperty()
  ip: string;

  @Column({ nullable: true, name: 'user_id' })
  @ApiProperty()
  userId: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  params: string;

  @Column({ length: 100, nullable: true })
  @ApiProperty()
  action: string;

  @Column({ length: 15, nullable: true })
  @ApiProperty()
  method: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  status: number;

  @Column({ type: 'int', nullable: true, name: 'consume_time', default: 0 })
  @ApiProperty()
  consumeTime: number;
}
