import { IsNumberString, IsOptional } from 'class-validator';

export class ImageCaptchaDto {
  @IsNumberString()
  @IsOptional()
  width: number;

  @IsNumberString()
  @IsOptional()
  height: number;
}
