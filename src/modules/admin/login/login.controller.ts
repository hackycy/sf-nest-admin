import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminController } from '../core/decorators/admin-controller.decorator';
import { Open } from '../core/decorators/open.decorator';
import { ImageCaptchaDto } from './login.dto';
import { ImageCaptcha, LoginToken } from './login.class';
import { LoginService } from './login.service';

@ApiTags('登录模块')
@AdminController('public')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @ApiOperation({
    summary: '获取登录图片验证码',
  })
  @Get('captcha/img')
  @Open()
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    return await this.loginService.createImageCaptcha(dto);
  }

  @Post('login')
  @Open()
  async login(@Body() dto: ImageCaptchaDto): Promise<LoginToken> {
    return {
      token: '',
    };
  }
}
