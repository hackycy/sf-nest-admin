import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PageOptionsDto {
  @ApiProperty({
    description: '当前页包含数量',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: number = 10;

  @ApiProperty({
    description: '当前页包含数量',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;
}
