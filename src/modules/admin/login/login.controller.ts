import { Body, Get } from '@nestjs/common';
import { AdminController } from '../core/decorators/admin-controller.decorator';
import { Open } from '../core/decorators/open.decorator';
import { ImageCaptchaDto } from './login.dto';
import { IImageCaptcha } from './login.interface';
import { AdminLoginService } from './login.service';

@AdminController('public')
export class AdminLoginController {
  constructor(private loginService: AdminLoginService) {}

  @Get('captcha/img')
  @Open()
  async get(@Body() dto: ImageCaptchaDto): Promise<IImageCaptcha> {
    return await this.loginService.createImageCaptcha(dto);
  }
}
