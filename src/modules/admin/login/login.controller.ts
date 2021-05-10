import { Get } from '@nestjs/common';
import { AdminController } from '../core/decorators/admin-controller.decorator';
import { Open } from '../core/decorators/open.decorator';

@AdminController('public')
export class AdminLoginController {
  @Get('captcha/img')
  @Open()
  get(): string {
    return 'aaaa';
  }
}
