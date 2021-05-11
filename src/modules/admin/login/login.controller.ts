import { Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminController } from '../core/decorators/admin-controller.decorator';
import { Open } from '../core/decorators/open.decorator';
import { ImageCaptchaDto } from './login.dto';
import { IImageCaptcha } from './login.interface';
import { AdminLoginService } from './login.service';

@ApiTags('登录模块')
@AdminController('public')
export class AdminLoginController {
  constructor(private loginService: AdminLoginService) {}

  @ApiOperation({
    summary: '获取登录图片验证码',
  })
  @Get('captcha/img')
  @Open()
  async get(@Query() dto: ImageCaptchaDto): Promise<IImageCaptcha> {
    return await this.loginService.createImageCaptcha(dto);
  }
}
