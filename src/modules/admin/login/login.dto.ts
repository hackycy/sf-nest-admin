import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class ImageCaptchaDto {
  @ApiProperty({
    required: false,
    default: 100,
    description: '验证码宽度',
  })
  @IsNumberString()
  @IsOptional()
  width: number;

  @ApiProperty({
    required: false,
    default: 50,
    description: '验证码宽度',
  })
  @IsNumberString()
  @IsOptional()
  height: number;
}
