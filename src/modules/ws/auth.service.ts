import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import { SocketException } from 'src/common/exceptions/socket.exception';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  checkAdminAuthToken(token: string): boolean | never {
    if (isEmpty(token)) {
      throw new SocketException(11001);
    }
    try {
      // 挂载对象到当前请求上
      this.jwtService.verify(token);
    } catch (e) {
      // 无法通过token校验
      throw new SocketException(11001);
    }
    return true;
  }
}
