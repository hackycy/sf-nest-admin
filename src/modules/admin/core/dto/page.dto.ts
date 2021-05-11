import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, Matches } from 'class-validator';

export class PageSearchGetDto {
  @ApiProperty({
    description: '当前页包含数量',
  })
  @IsNumberString()
  @Matches(/!(^-)/)
  limit: number;

  @ApiProperty({
    description: '当前页包含数量',
  })
  @IsNumberString()
  @Matches(/!(^-)/)
  page: number;
}
