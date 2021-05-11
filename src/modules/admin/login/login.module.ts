import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule {}
