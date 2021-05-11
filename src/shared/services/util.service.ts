import { Injectable } from '@nestjs/common';
import { customAlphabet, nanoid } from 'nanoid';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilService {
  constructor(private configService: ConfigService) {}

  /**
   * Root Role Id
   */
  public getRootRoleId(): number {
    return this.configService.get<number>('rootRoleId');
  }

  /**
   * AES加密
   */
  public aesEncrypt(msg: string, secret: string): string {
    return CryptoJS.AES.encrypt(msg, secret).toString();
  }

  /**
   * AES解密
   */
  public aesDecrypt(encrypted: string, secret: string): string {
    return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
  }

  /**
   * md5加密
   */
  public md5(msg: string): string {
    return CryptoJS.MD5(msg).toString();
  }

  /**
   * 生成一个UUID
   */
  public generateUUID(): string {
    return nanoid();
  }

  /**
   * 生成一个随机的值
   */
  public generateRandomValue(
    length: number,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
  ): string {
    const customNanoid = customAlphabet(placeholder, length);
    return customNanoid();
  }
}
