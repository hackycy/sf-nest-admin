import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { AdminWSGateway } from 'src/modules/ws/admin-ws.gateway';
import { EntityManager } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import { SysUserService } from '../user/user.service';
import { OnlineUserInfo } from './online.class';

@Injectable()
export class SysOnlineService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    private userService: SysUserService,
    private adminWsGateWay: AdminWSGateway,
    private jwtService: JwtService,
  ) {}

  /**
   * 罗列在线用户列表
   */
  async listOnlineUser(currentUid: number): Promise<OnlineUserInfo[]> {
    const onlineSockets = await this.adminWsGateWay.socketServer.fetchSockets();
    if (!onlineSockets || onlineSockets.length <= 0) {
      return [];
    }
    const onlineIds = onlineSockets.map((socket) => {
      const token = socket.handshake.query?.token as string;
      return this.jwtService.verify(token).uid;
    });
    return await this.findLastLoginInfoList(onlineIds, currentUid);
  }

  /**
   * 根据用户id列表查找最近登录信息和用户信息
   */
  async findLastLoginInfoList(
    ids: number[],
    currentUid: number,
  ): Promise<OnlineUserInfo[]> {
    const rootUserId = await this.userService.findRootUserId();
    const result = await this.entityManager.query(
      `
      SELECT sys_login_log.createTime, sys_login_log.ip, sys_login_log.ua, sys_user.id, sys_user.username, sys_user.name
      FROM sys_login_log 
      INNER JOIN sys_user ON sys_login_log.user_id = sys_user.id 
      WHERE sys_login_log.createTime IN (SELECT MAX(createTime) as createTime FROM sys_login_log GROUP BY user_id)
      `,
      [ids],
    );
    if (result) {
      const parser = new UAParser();
      return result.map((e) => {
        const u = parser.setUA(e.ua).getResult();
        return {
          id: e.id,
          ip: e.ip,
          username: `${e.name}（${e.username}）`,
          isCurrent: currentUid === e.id,
          time: e.createTime,
          os: `${u.os.name} ${u.os.version}`,
          browser: `${u.browser.name} ${u.browser.version}`,
          disable: currentUid === e.id || e.id === rootUserId,
        };
      });
    }
    return [];
  }
}
