import { Module } from '@nestjs/common';
import { AdminGateway } from './admin.gateway';

const providers = [AdminGateway];

/**
 * WebSocket Module
 */
@Module({
  providers,
  exports: providers,
})
export class WSModule {}
