import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { isEmpty } from 'lodash';
import { Server, Socket } from 'socket.io';
import { IAdminUser } from '../admin/admin.interface';
import { AuthService } from './auth.service';
import { EVENT_ONLINE } from './ws.event';

/**
 * Admin WebSokcet网关
 */
@WebSocketGateway(parseInt(process.env.WS_PORT || '7002'), {
  path: '/ws',
  namespace: '/admin',
})
export class AdminWSGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  private wss: Server;

  get socketServer(): Server {
    return this.wss;
  }

  constructor(private authService: AuthService) {}

  /**
   * OnGatewayInit
   * @param server Server
   */
  afterInit() {
    // TODO
  }

  /**
   * OnGatewayConnection
   */
  async handleConnection(client: Socket): Promise<void> {
    let user: IAdminUser | null = null;
    try {
      user = this.authService.checkAdminAuthToken(
        client.handshake?.query?.token,
      );
    } catch (e) {
      // no auth
      client.disconnect();
    }
    // pass token
    if (!isEmpty(user)) {
      client.emit(EVENT_ONLINE);
    }
  }

  /**
   * OnGatewayDisconnect
   */
  async handleDisconnect(): Promise<void> {
    // TODO
  }
}
