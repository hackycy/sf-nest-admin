import { DynamicModule, Module } from '@nestjs/common';
import { LOGGER_MODULE_OPTIONS } from './logger.constants';
import { LoggerModuleOptions } from './logger.interface';
import { LoggerService } from './logger.service';

@Module({})
export class LoggerModule {
  static register(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        LoggerService,
        {
          provide: LOGGER_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [LoggerService],
    };
  }
}
