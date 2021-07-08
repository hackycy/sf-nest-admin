import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { RedisService } from 'src/shared/services/redis.service';
import { EntityManager } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import { SysUserService } from '../user/user.service';
import { OnlineUserInfo } from './online.class';

@Injectable()
export class SysOnlineService {
  constructor(
    private redisService: RedisService,
    @InjectEntityManager() private entityManager: EntityManager,
    private userService: SysUserService,
  ) {}

  async listOnlineUser(currentUid: number): Promise<OnlineUserInfo[]> {
    const onlineUserIds: string[] = await this.redisService
      .getRedis()
      .keys('admin:token:*');
    const formatNumberIds: number[] = onlineUserIds.map((e) => {
      const uid = e.split('admin:token:')[1];
      return parseInt(uid);
    });
    return await this.findLastLoginInfoList(formatNumberIds, currentUid);
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
    SELECT n.*, u.username
      FROM sys_login_log n
      INNER JOIN (
        SELECT user_id, MAX(createTime) AS createTime
        FROM sys_login_log GROUP BY user_id
      ) AS max USING (user_id, createTime)
      INNER JOIN sys_user u ON n.user_id = u.id
      WHERE n.user_id IN (?)
    `,
      [ids],
    );
    if (result) {
      const parser = new UAParser();
      return result.map((e) => {
        const u = parser.setUA(e.ua).getResult();
        return {
          id: e.user_id,
          ip: e.ip,
          username: e.username,
          isCurrent: currentUid === e.user_id,
          time: e.createTime,
          status: 1,
          os: `${u.os.name} ${u.os.version}`,
          browser: `${u.browser.name} ${u.browser.version}`,
          disable: currentUid === e.user_id || e.user_id === rootUserId,
        };
      });
    }
    return [];
  }
}
