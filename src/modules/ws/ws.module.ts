import { Module } from '@nestjs/common';
import { AdminWSGateway } from './admin-ws.gateway';

const providers = [AdminWSGateway];

/**
 * WebSocket Module
 */
@Module({
  providers,
  exports: providers,
})
export class WSModule {}
