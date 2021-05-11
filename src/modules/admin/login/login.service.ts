import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as svgCaptcha from 'svg-captcha';
import { REDIS_INSTANCE } from 'src/common/contants/common.contants';
import { IImageCaptcha } from './login.interface';
import { isEmpty } from 'lodash';
import { ImageCaptchaDto } from './login.dto';
import { UtilProvider } from 'src/utils/util.provider';

@Injectable()
export class AdminLoginService {
  constructor(
    @Inject(REDIS_INSTANCE) private redis: Redis,
    private util: UtilProvider,
  ) {}

  /**
   * 创建验证码并缓存加入redis缓存
   * @param captcha 验证码长宽
   * @returns svg & id obj
   */
  async createImageCaptcha(captcha: ImageCaptchaDto): Promise<IImageCaptcha> {
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
      60 * 10,
    );
    return result;
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
