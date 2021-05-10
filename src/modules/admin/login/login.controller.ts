import { Controller, Get } from '@nestjs/common';

@Controller()
export class AdminLoginController {
  @Get('a')
  get(): string {
    return 'aaaa';
  }
}
