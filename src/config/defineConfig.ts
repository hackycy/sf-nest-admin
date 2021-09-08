import { LogLevel } from '@nestjs/common';
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

/**
 * 日志配置
 */
export interface LoggerConfigOptions {
  /**
   * 日志文件输出
   * 默认只会输出 log 及以上（warn 和 error）的日志到文件中，等级级别如下
   */
  level?: LogLevel | false;

  /**
   * 控制台输出等级，同Nest配置
   * debug: 0,
   * verbose: 1,
   * log: 2,
   * warn: 3,
   * error: 4,
   */
  consoleLevel?: LogLevel[] | false;

  /**
   * 如果启用，将打印当前和上一个日志消息之间的时间戳（时差）
   */
  timestamp?: boolean;

  /**
   * 生产环境下，默认会关闭终端日志输出，如有需要，可以设置为 false
   */
  disableConsoleAtProd?: boolean;

  /**
   * If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number.
   * https://github.com/winstonjs/winston-daily-rotate-file
   */
  maxSize?: string;
  /**
   * Maximum number of logs to keep.
   * If not set, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix. (default: null)
   */
  maxFiles?: string;

  /**
   * 开发环境下日志产出的目录，绝对路径
   * 开发环境下为了避免冲突以及集中管理，日志会打印在项目目录下的 logs 目录
   */
  dir?: string;

  /**
   * 任何 logger 的 .error() 调用输出的日志都会重定向到这里，重点通过查看此日志定位异常，默认文件名为 common-error.%DATE%.log
   * 注意：此文件名可以包含%DATE%占位符
   */
  errorLogName?: string;

  /**
   * 应用相关日志，供应用开发者使用的日志。我们在绝大数情况下都在使用它，默认文件名为 web.%DATE%.log
   * 注意：此文件名可以包含%DATE%占位符
   */
  appLogName?: string;
}
