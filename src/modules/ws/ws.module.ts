import { Module } from '@nestjs/common';
import { WSGateway } from './ws.gateway';

const providers = [WSGateway];

/**
 * WebSocket Module
 */
@Module({
  providers,
  exports: providers,
})
export class WSModule {}
