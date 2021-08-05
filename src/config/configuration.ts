import { conf } from 'qiniu';
import { Logger } from '@nestjs/common';
import { merge } from 'lodash';
import DefaultConfig from './config.default';

/**
 * check dev env
 * @returns boolean true is dev
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 根据环境变量判断使用配置
 */
export default () => {
  let envConfig: IConfig = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    envConfig = require(`./config.${process.env.NODE_ENV}`).default;
  } catch (e) {
    const logger = new Logger('ConfigModule');
    logger.error(e);
  }
  // 合并配置
  return merge(DefaultConfig, envConfig);
};

/**
 * sf-admin 配置
 */
export interface IConfig {
  /**
   * 管理员角色ID，一旦分配，该角色下分配的管理员都为超级管理员
   */
  rootRoleId?: number;

  /**
   * 后台管理jwt token密钥
   */
  jwt?: {
    secret: string;
  };

  /**
   * 数据库配置
   */
  database?: {
    type?: string;
    host?: string;
    port?: number | string;
    username?: string;
    password?: string;
    database?: string;
    synchronize?: boolean;
    logging?: any;
  };

  /**
   * redis 配置
   */
  redis?: {
    host?: string;
    port?: number | string;
    password?: string;
    db?: number;
  };

  /**
   * 七牛配置
   */
  qiniu?: {
    accessKey?: string;
    secretKey?: string;
    bucket?: string;
    zone?: conf.Zone;
    domain?: string;
    access?: string;
  };

  /**
   * 邮件配置（未使用）
   */
  mailer?: {
    host?: string;
    port?: number;
    auth?: {
      user?: string;
      pass?: string;
    };
    secure?: boolean;
  };

  /**
   * 高德地图APi（未使用）
   */
  amap?: {
    key?: string;
  };
}
