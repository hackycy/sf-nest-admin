import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @CreateDateColumn()
  @ApiProperty()
  createTime: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updateTime: Date;
}
