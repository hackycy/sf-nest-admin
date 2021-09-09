import {
  Injectable,
  Optional,
  Inject,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import { clc, yellow } from '@nestjs/common/utils/cli-colors.util';
import {
  DEFAULT_ERROR_LOG_NAME,
  DEFAULT_WEB_LOG_NAME,
  LOGGER_MODULE_OPTIONS,
  PROJECT_LOG_DIR_NAME,
} from './logger.constants';
import { LoggerModuleOptions, WinstonLogLevel } from './logger.interface';
import { getAppRootPath } from './utils/app-root-path.util';
import { getHomedir } from './utils/home-dir';
import { createLogger, Logger as WinstonLogger, format } from 'winston';
import { join } from 'path';
import * as WinstonDailyRotateFile from 'winston-daily-rotate-file';
import { isDev } from 'src/config/env';
import { isPlainObject } from 'lodash';

/**
 * 默认输入的日志等级
 */
const DEFAULT_LOG_LEVELS: WinstonLogLevel = isDev() ? 'info' : 'error';

/**
 * 日志输出等级，基于Nest配置扩展，与winston配合，由于log等级与winston定义冲突，需要转为info
 * https://github.com/nestjs/nest/blob/master/packages/common/services/utils/is-log-level-enabled.util.ts
 */
const LOG_LEVEL_VALUES: Record<WinstonLogLevel, number> = {
  debug: 4,
  verbose: 3,
  info: 2,
  warn: 1,
  error: 0,
};

@Injectable()
export class LoggerService implements NestLoggerService {
  private originalContext?: string;
  private static lastTimestampAt?: number;
  /**
   * 日志文件存放文件夹路径
   */
  private logDir: string;

  /**
   * winston实例
   */
  private winstonLogger: WinstonLogger;

  constructor();
  constructor(context: string, options: LoggerModuleOptions);
  constructor(
    @Optional() protected context?: string,
    @Optional()
    @Inject(LOGGER_MODULE_OPTIONS)
    protected options: LoggerModuleOptions = {},
  ) {
    // 初始化
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
    } else if (this.options.dir) {
      this.logDir = this.options.dir;
    } else {
      // 如果为空，则使用 用户主目录 + 应用名称 路径进行保存
      this.logDir = join(getHomedir(), this.options.logDirName);
    }
    // 多路日志
    const webTransport = new WinstonDailyRotateFile({
      dirname: this.logDir,
      filename: this.options.appLogName,
    });
    // 所有error级别都记录在该文件下
    const errorTransport = new WinstonDailyRotateFile({
      dirname: this.logDir,
      filename: this.options.errorLogName,
      level: 'error',
    });
    // 初始化winston
    this.winstonLogger = createLogger({
      level: this.options.level,
      format: format.json(),
      levels: LOG_LEVEL_VALUES,
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
  public initDefaultConfig() {
    // 默认配置
    if (this.options.timestamp === undefined) {
      this.options.timestamp = true;
    }
    if (!this.options.level) {
      this.options.level = DEFAULT_LOG_LEVELS;
    }
    if (!this.options.consoleLevel) {
      this.options.consoleLevel = DEFAULT_LOG_LEVELS;
    }
    // 默认输出文件名
    if (!this.options.appLogName) {
      this.options.appLogName = DEFAULT_WEB_LOG_NAME;
    }
    if (!this.options.errorLogName) {
      this.options.errorLogName = DEFAULT_ERROR_LOG_NAME;
    }
  }

  /**
   * Write a 'info' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: [...any, string?]): void;
  log(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('info')) {
      const { messages, context } = this.getContextAndMessagesToPrint([
        message,
        ...optionalParams,
      ]);
      this.printMessages(messages, context, 'info');
    }
  }

  /**
   * Write an 'error' level log, if the configured level allows for it.
   * Prints to `stderr` with newline.
   */
  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: [...any, string?, string?]): void;
  error(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('error')) {
      const { messages, context, stack } =
        this.getContextAndStackAndMessagesToPrint([message, ...optionalParams]);

      this.printMessages(messages, context, 'error', 'stderr');
      this.printStackTrace(stack);
    }
  }

  /**
   * Write a 'warn' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: [...any, string?]): void;
  warn(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('warn')) {
      const { messages, context } = this.getContextAndMessagesToPrint([
        message,
        ...optionalParams,
      ]);
      this.printMessages(messages, context, 'warn');
    }
  }

  /**
   * Write a 'debug' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  debug(message: any, context?: string): void;
  debug(message: any, ...optionalParams: [...any, string?]): void;
  debug(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('debug')) {
      const { messages, context } = this.getContextAndMessagesToPrint([
        message,
        ...optionalParams,
      ]);
      this.printMessages(messages, context, 'debug');
    }
  }

  /**
   * Write a 'verbose' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  verbose(message: any, context?: string): void;
  verbose(message: any, ...optionalParams: [...any, string?]): void;
  verbose(message: any, ...optionalParams: any[]) {
    if (this.isLevelEnabled('verbose')) {
      const { messages, context } = this.getContextAndMessagesToPrint([
        message,
        ...optionalParams,
      ]);
      this.printMessages(messages, context, 'verbose');
    }
  }

  /**
   * Set logger context
   * @param context context
   */
  setContext(context: string) {
    this.context = context;
  }

  /**
   * Resets the logger context to the value that was passed in the constructor.
   */
  resetContext() {
    this.context = this.originalContext;
  }

  isLevelEnabled(level: WinstonLogLevel): boolean {
    // 默认禁止生产模式控制台日志输出
    if (!isDev() && !this.options.disableConsoleAtProd) {
      return false;
    }
    if (this.options.consoleLevel === 'none') {
      return false;
    }
    return LOG_LEVEL_VALUES[level] <= LOG_LEVEL_VALUES[level];
  }

  // code from -> https://github.com/nestjs/nest/blob/master/packages/common/services/console-logger.service.ts
  protected getTimestamp(): string {
    const localeStringOptions = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: '2-digit',
      month: '2-digit',
    };
    return new Date(Date.now()).toLocaleString(
      undefined,
      localeStringOptions as Intl.DateTimeFormatOptions,
    );
  }

  protected printMessages(
    messages: unknown[],
    context = '',
    logLevel: WinstonLogLevel = 'info',
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    const color = this.getColorByLogLevel(logLevel);
    messages.forEach((message) => {
      const output = isPlainObject(message)
        ? `${color('Object:')}\n${JSON.stringify(
            message,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2,
          )}\n`
        : color(message as string);

      const pidMessage = color(`[Nest] ${process.pid}  - `);
      const contextMessage = context ? yellow(`[${context}] `) : '';
      const timestampDiff = this.updateAndGetTimestampDiff();
      const formattedLogLevel = color(logLevel.toUpperCase().padStart(7, ' '));
      const computedMessage = `${pidMessage}${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${output}${timestampDiff}\n`;

      process[writeStreamType ?? 'stdout'].write(computedMessage);
    });
  }

  protected printStackTrace(stack: string) {
    if (!stack) {
      return;
    }
    process.stderr.write(`${stack}\n`);
  }

  private updateAndGetTimestampDiff(): string {
    const includeTimestamp =
      LoggerService.lastTimestampAt && this.options?.timestamp;
    const result = includeTimestamp
      ? yellow(` +${Date.now() - LoggerService.lastTimestampAt}ms`)
      : '';
    LoggerService.lastTimestampAt = Date.now();
    return result;
  }

  private getContextAndMessagesToPrint(args: unknown[]) {
    if (args?.length <= 1) {
      return { messages: args, context: this.context };
    }
    const lastElement = args[args.length - 1];
    const isContext = typeof lastElement === 'string';
    if (!isContext) {
      return { messages: args, context: this.context };
    }
    return {
      context: lastElement as string,
      messages: args.slice(0, args.length - 1),
    };
  }

  private getContextAndStackAndMessagesToPrint(args: unknown[]) {
    const { messages, context } = this.getContextAndMessagesToPrint(args);
    if (messages?.length <= 1) {
      return { messages, context };
    }
    const lastElement = messages[messages.length - 1];
    const isStack = typeof lastElement === 'string';
    if (!isStack) {
      return { messages, context };
    }
    return {
      stack: lastElement as string,
      messages: messages.slice(0, messages.length - 1),
      context,
    };
  }

  private getColorByLogLevel(level: WinstonLogLevel): (text: string) => string {
    switch (level) {
      case 'debug':
        return clc.magentaBright;
      case 'warn':
        return clc.yellow;
      case 'error':
        return clc.red;
      case 'verbose':
        return clc.cyanBright;
      default:
        return clc.green;
    }
  }
}
