import { LogLevel } from '@nestjs/common';
import { LoggerConfigOptions } from 'src/config/defineConfig';

export interface LoggerModuleOptions extends LoggerConfigOptions {
  consoleLevel?: LogLevel[];
  level?: LogLevel;
  // 默认输出为 用户主目录 + logDirName
  logDirName?: string;
}
