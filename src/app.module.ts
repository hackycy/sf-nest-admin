import './polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import Configuration from './config/configuration';
import { AdminModule } from './modules/admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { MissionModule } from './mission/mission.module';
import { WSModule } from './modules/ws/ws.module';
import { LoggerModule } from './shared/logger/logger.module';
import { WinstonLogLevel } from './shared/logger/logger.interface';
import { TypeORMLoggerService } from './shared/logger/typeorm-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        autoLoadEntities: true,
        type: configService.get<any>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get('database.logging'),
        // 自定义日志
        logger: new TypeORMLoggerService(
          configService.get('database.logging'),
          configService.get('database.maxSize'),
          configService.get('database.maxFiles'),
        ),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRoot({}),
    // custom logger
    LoggerModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            level: configService.get<WinstonLogLevel>('logger.level'),
            consoleLevel: configService.get<WinstonLogLevel>(
              'logger.consoleLevel',
            ),
            timestamp: configService.get<boolean>('logger.timestamp'),
            maxFiles: configService.get<string>('logger.maxFiles'),
            maxSize: configService.get<string>('logger.maxSize'),
            disableConsoleAtProd: configService.get<boolean>(
              'logger.disableConsoleAtProd',
            ),
            dir: configService.get<string>('logger.dir'),
            errorLogName: configService.get<string>('logger.errorLogName'),
            appLogName: configService.get<string>('logger.appLogName'),
          };
        },
        inject: [ConfigService],
      },
      // global module
      true,
    ),
    // custom module
    SharedModule,
    // mission module
    MissionModule,
    // application modules import
    AdminModule,
    // websocket module
    WSModule,
  ],
})
export class AppModule {}
