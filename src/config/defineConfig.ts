import { conf } from 'qiniu';

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

/**
 * 日志配置
 */
export interface LoggerConfigOptions {
  /**
   * 默认只会输出 INFO 及以上（WARN 和 ERROR）的日志到文件中
   */
  level?: string;

  /**
   * 生产环境打印 debug 日志
   */
  allowDebugAtProd?: boolean;

  /**
   * 开发环境下日志产出的目录，绝对路径
   * 开发环境下为了避免冲突以及集中管理，日志会打印在项目目录下的 logs 目录
   */
  dir?: string;

  /**
   * 日志编码，默认为 utf-8
   */
  encoding?: string;

  /**
   * 接口访问日志，默认文件名为 access.log
   */
  accessLogName?: string;

  /**
   * 任何 logger 的 .error() 调用输出的日志都会重定向到这里，重点通过查看此日志定位异常，默认文件名为 common-error.log
   */
  errorLogName?: string;

  /**
   * 应用相关日志，供应用开发者使用的日志。我们在绝大数情况下都在使用它，默认文件名为 web.log
   */
  appLogName?: string;
}
