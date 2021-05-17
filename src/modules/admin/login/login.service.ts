import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as svgCaptcha from 'svg-captcha';
import { REDIS_INSTANCE } from 'src/common/contants/common.contants';
import { ImageCaptcha, PermMenuInfo } from './login.class';
import { isEmpty } from 'lodash';
import { ImageCaptchaDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { UtilService } from 'src/shared/services/util.service';
import { SysMenuService } from '../system/menu/menu.service';
import { SysUserService } from '../system/user/user.service';
import { ApiException } from 'src/common/exceptions/api.exception';
import { SysLogService } from '../system/log/log.service';

@Injectable()
export class LoginService {
  constructor(
    @Inject(REDIS_INSTANCE) private redis: Redis,
    private menuService: SysMenuService,
    private userService: SysUserService,
    private logService: SysLogService,
    private util: UtilService,
    private jwtService: JwtService,
  ) {}

  /**
   * 创建验证码并缓存加入redis缓存
   * @param captcha 验证码长宽
   * @returns svg & id obj
   */
  async createImageCaptcha(captcha: ImageCaptchaDto): Promise<ImageCaptcha> {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height,
      charPreset: '1234567890',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: this.util.generateUUID(), // this.utils.generateUUID()
    };
    // 10分钟过期时间
    await this.redis.set(
      `admin:captcha:img:${result.id}`,
      svg.text,
      'EX',
      60 * 5,
    );
    return result;
  }

  /**
   * 校验验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<void> {
    const result = await this.redis.get(`admin:captcha:img:${id}`);
    if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase()) {
      throw new ApiException(10002);
    }
    // 校验成功后移除验证码
    await this.redis.del(`admin:captcha:img:${id}`);
  }

  /**
   * 获取登录JWT
   * 返回null则账号密码有误，不存在该用户
   */
  async getLoginSign(
    username: string,
    password: string,
    ip: string,
    ua: string,
  ): Promise<string> {
    const user = await this.userService.findUserByUserName(username);
    if (isEmpty(user)) {
      throw new ApiException(10003);
    }
    const comparePassword = this.util.md5(`${password}${user.psalt}`);
    if (user.password !== comparePassword) {
      throw new ApiException(10003);
    }
    const perms = await this.menuService.getPerms(user.id);
    const jwtSign = this.jwtService.sign(
      {
        uid: parseInt(user.id.toString()),
        pv: 1,
      },
      {
        expiresIn: '24h',
      },
    );
    await this.redis.set(`admin:passwordVersion:${user.id}`, 1);
    await this.redis.set(`admin:token:${user.id}`, jwtSign);
    await this.redis.set(`admin:perms:${user.id}`, JSON.stringify(perms));
    await this.logService.saveLoginLog(user.id, ip, ua);
    return jwtSign;
  }

  /**
   * 清除登录状态信息
   */
  async clearLoginStatus(uid: number): Promise<void> {
    await this.userService.forbidden(uid);
  }

  /**
   * 获取权限菜单
   */
  async getPermMenu(uid: number): Promise<PermMenuInfo> {
    const menus = await this.menuService.getMenus(uid);
    const perms = await this.menuService.getPerms(uid);
    return { menus, perms };
  }

  async getRedisPasswordVersionById(id: number): Promise<string> {
    return this.redis.get(`admin:passwordVersion:${id}`);
  }

  async getRedisTokenById(id: number): Promise<string> {
    return this.redis.get(`admin:token:${id}`);
  }

  async getRedisPermsById(id: number): Promise<string> {
    return this.redis.get(`admin:perms:${id}`);
  }
}
