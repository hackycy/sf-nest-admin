import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { AdminWSGateway } from './admin-ws.gateway';
import { AuthService } from './auth.service';

const providers = [AdminWSGateway, AuthService];

/**
 * WebSocket Module
 */
@Module({
  imports: [AdminModule],
  providers,
  exports: providers,
})
export class WSModule {}
