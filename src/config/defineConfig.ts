import { conf } from 'qiniu';
import { LoggerModuleOptions as LoggerConfigOptions } from 'src/shared/logger/logger.interface';

/**
 * 用于智能提示
 */
export function defineConfig(config: IConfig): IConfig {
  return config;
}

/**
 * sf-admin 配置
 */
export interface IConfig {
  /**
   * 应用名称
   */
  appName?: string;
  /**
   * 管理员角色ID，一旦分配，该角色下分配的管理员都为超级管理员
   */
  rootRoleId?: number;
  jwt?: JwtConfigOptions;
  database?: DataBaseConfigOptions;
  redis?: RedisConfigOptions;
  qiniu?: QiniuConfigOptions;
  logger?: LoggerConfigOptions;
}

/**
 * Jwt密钥配置
 */
export interface JwtConfigOptions {
  secret: string;
}

/**
 * 七牛配置
 */
export interface QiniuConfigOptions {
  accessKey?: string;
  secretKey?: string;
  bucket?: string;
  zone?: conf.Zone;
  domain?: string;
  access?: string;
}

/**
 * redis 配置
 */
export interface RedisConfigOptions {
  host?: string;
  port?: number | string;
  password?: string;
  db?: number;
}

/**
 * MySQL 数据库配置
 */
export interface DataBaseConfigOptions {
  type?: string;
  host?: string;
  port?: number | string;
  username?: string;
  password?: string;
  database?: string;
  synchronize?: boolean;
  logging?: any;
}
