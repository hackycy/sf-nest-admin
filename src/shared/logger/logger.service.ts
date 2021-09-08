/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LogLevel,
  ConsoleLogger,
  Injectable,
  Optional,
  Inject,
} from '@nestjs/common';
import { isDev } from 'src/config/configuration';
import {
  DEFAULT_ACCESS_LOG_NAME,
  DEFAULT_ERROR_LOG_NAME,
  DEFAULT_SQL_LOG_NAME,
  DEFAULT_TASK_LOG_NAME,
  DEFAULT_WEB_LOG_NAME,
  LOGGER_MODULE_OPTIONS,
  PROJECT_LOG_DIR_NAME,
} from './logger.constants';
import { LoggerModuleOptions } from './logger.interface';
import { getAppRootPath } from './utils/app-root-path.util';
import { getHomedir } from './utils/home-dir';
import { createLogger, Logger as WinstonLogger, format } from 'winston';
import { join } from 'path';
import * as WinstonDailyRotateFile from 'winston-daily-rotate-file';

/**
 * 默认只会输出该等级以上的日志到文件中。
 */
const DEFAULT_LOG_LEVELS: LogLevel = 'log';

/**
 * 日志输出等级，基于Nest配置扩展，与winston配合
 * https://github.com/nestjs/nest/blob/master/packages/common/services/utils/is-log-level-enabled.util.ts
 */
const LOG_LEVEL_VALUES_REVERSE: Record<LogLevel, number> = {
  debug: 4,
  verbose: 3,
  log: 2,
  warn: 1,
  error: 0,
};

@Injectable()
export class LoggerService extends ConsoleLogger {
  /**
   * 日志文件存放文件夹路径
   */
  private logDir: string;

  /**
   * winston实例
   */
  private winstonLogger: WinstonLogger;

  constructor();
  constructor(context: string, config: LoggerModuleOptions);
  constructor(
    @Optional() protected context?: string,
    @Optional()
    @Inject(LOGGER_MODULE_OPTIONS)
    protected config: LoggerModuleOptions = {},
  ) {
    super(context, {
      timestamp: config.timestamp === undefined ? true : config.timestamp,
      logLevels: config.consoleLevel,
    });
    this.initDefaultConfig();
    this.initWinston();
  }

  /**
   * 初始化winston
   */
  private initWinston() {
    // 配置日志输出目录
    if (isDev()) {
      this.logDir = join(getAppRootPath(), PROJECT_LOG_DIR_NAME);
    } else if (this.config.dir) {
      this.logDir = this.config.dir;
    } else {
      // 如果为空，则使用 用户主目录 + 应用名称 路径进行保存
      this.logDir = join(getHomedir(), this.config.logDirName);
    }
    // 多路日志
    const webTransport = new WinstonDailyRotateFile({
      dirname: this.logDir,
      filename: this.config.appLogName,
    });
    const errorTransport = new WinstonDailyRotateFile({
      dirname: this.logDir,
      filename: this.config.errorLogName,
      level: 'error',
    });
    // 初始化winston
    this.winstonLogger = createLogger({
      level: this.config.level,
      format: format.json(),
      levels: LOG_LEVEL_VALUES_REVERSE,
      transports: [webTransport, errorTransport],
    });
  }

  /**
   * 获取日志存放路径
   */
  public getLogDir(): string {
    return this.logDir;
  }

  /**
   * 获取winston实例
   */
  public getWinstonLogger(): WinstonLogger {
    return this.winstonLogger;
  }

  /**
   * 初始化默认配置
   */
  private initDefaultConfig() {
    // 默认配置
    if (!this.config.level) {
      this.config.level = DEFAULT_LOG_LEVELS;
    }
    if (!this.config.appLogName) {
      this.config.appLogName = DEFAULT_WEB_LOG_NAME;
    }
    if (!this.config.errorLogName) {
      this.config.errorLogName = DEFAULT_ERROR_LOG_NAME;
    }
  }

  log(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    // this.winstonLogger.log('log', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    super.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
  }

  isLevelEnabled(level: LogLevel): boolean {
    // 默认禁止生产模式控制台日志输出
    if (!isDev() && !this.config.disableConsoleAtProd) {
      return false;
    }
    return super.isLevelEnabled(level);
  }
}
