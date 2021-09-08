/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LogLevel,
  ConsoleLogger,
  Injectable,
  Optional,
  Inject,
} from '@nestjs/common';
import { isDev } from 'src/config/configuration';
import { LOGGER_MODULE_OPTIONS } from './logger.constants';
import { LoggerModuleOptions } from './logger.interface';
import { getAppRootPath } from './utils/app-root-path.util';
import { getHomedir } from './utils/home-dir';
import { createLogger, Logger as winstonLogger } from 'winston';

/**
 * 默认只会输出该等级以上的日志到文件中。
 */
const DEFAULT_LOG_LEVELS: LogLevel = 'log';

/**
 * 与Nestjs配置反转
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
  private logDir: string;
  private winstonLogger: winstonLogger;

  constructor();
  constructor(context: string, config: LoggerModuleOptions);
  constructor(
    @Optional() protected context?: string,
    @Optional()
    @Inject(LOGGER_MODULE_OPTIONS)
    protected config: LoggerModuleOptions = {},
  ) {
    super(context, { timestamp: true, logLevels: config.consoleLevel });
    // 默认配置
    if (!config.level) {
      config.level = DEFAULT_LOG_LEVELS;
    }
    // 配置日志输出目录
    if (isDev()) {
      this.logDir = getAppRootPath();
    } else if (config.dir) {
      this.logDir = config.dir;
    } else {
      // 如果为空，则使用用户主目录进行保存
      this.logDir = getHomedir();
    }
    // 初始化winston
    this.winstonLogger = createLogger({
      level: config.level,
    });
  }

  log(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
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

  /**
   * 判断是否需要输出至文件
   * @param level 日志等级
   */
  isFileLevelEnabled(level: LogLevel): boolean {
    if (typeof this.config.level === 'boolean') {
      return false;
    }
    return (
      LOG_LEVEL_VALUES_REVERSE[level] >=
      LOG_LEVEL_VALUES_REVERSE[this.config.level]
    );
  }

  /**
   * 重写，生产模式下禁用，除非开启配置
   */
  isLevelEnabled(level: LogLevel): boolean {
    // 默认禁止生产模式下的控制台日志输出
    if (!isDev() && !this.config.allowDebugAtProd) {
      return false;
    }
    return super.isLevelEnabled(level);
  }
}
