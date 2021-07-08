import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { isEmpty } from 'lodash';
import { Server, Socket } from 'socket.io';
import { ResOp } from 'src/common/class/res.class';
import { IAdminUser } from '../admin/admin.interface';
import { SysUserService } from '../admin/system/user/user.service';
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

  constructor(
    private authService: AuthService,
    private sysUserService: SysUserService,
  ) {}

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
      const account = await this.sysUserService.getAccountInfo(user.uid);
      // 广播该管理员上线通知
      client.broadcast.emit(
        EVENT_ONLINE,
        ResOp.success({ account: account.name }),
      );
    }
  }

  /**
   * OnGatewayDisconnect
   */
  async handleDisconnect(): Promise<void> {
    // TODO
  }
}
