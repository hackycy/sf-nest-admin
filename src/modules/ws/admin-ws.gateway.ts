import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
  handleConnection(client: Socket) {
    // TODO
    console.log('handleConnection：' + client.id);
  }

  /**
   * OnGatewayDisconnect
   */
  handleDisconnect() {
    // TODO
    console.log('handleDisconnect');
  }
}
