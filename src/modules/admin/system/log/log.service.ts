import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { REDIS_INSTANCE } from 'src/common/contants/common.contants';
import SysLoginLog from 'src/entities/admin/sys-login-log.entity';
import SysReqLog from 'src/entities/admin/sys-req-log.entity';
import SysTaskLog from 'src/entities/admin/sys-task-log.entity';
import { EntityManager, Repository } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import { SysUserService } from '../user/user.service';
import { LoginLogInfo, OnlineUserInfo, TaskLogInfo } from './log.class';

@Injectable()
export class SysLogService {
  constructor(
    @InjectRepository(SysLoginLog)
    private loginLogRepository: Repository<SysLoginLog>,
    @InjectRepository(SysReqLog)
    private reqLogRepository: Repository<SysReqLog>,
    @InjectRepository(SysTaskLog)
    private taskLogRepository: Repository<SysTaskLog>,
    @Inject(REDIS_INSTANCE) private redis: Redis,
    @InjectEntityManager() private entityManager: EntityManager,
    private userService: SysUserService,
  ) {}

  /**
   * 记录登录日志
   */
  async saveLoginLog(uid: number, ip: string, ua: string): Promise<void> {
    await this.loginLogRepository.save({
      ip,
      userId: uid,
      ua,
    });
  }

  /**
   * 计算登录日志日志总数
   */
  async countLoginLog(): Promise<number> {
    return await this.loginLogRepository.count();
  }

  /**
   * 分页加载日志信息
   */
  async pageGetLoginLog(page: number, count: number): Promise<LoginLogInfo[]> {
    // const result = await this.getRepo().admin.sys.LoginLog.find({
    //   order: {
    //     id: 'DESC',
    //   },
    //   take: count,
    //   skip: page * count,
    // });
    const result = await this.loginLogRepository
      .createQueryBuilder('login_log')
      .innerJoinAndSelect('sys_user', 'user', 'login_log.user_id = user.id')
      .orderBy('login_log.createTime', 'DESC')
      .offset(page * count)
      .limit(count)
      .getRawMany();
    const parser = new UAParser();
    return result.map((e) => {
      const u = parser.setUA(e.login_log_ua).getResult();
      return {
        id: e.login_log_id,
        ip: e.login_log_ip,
        os: `${u.os.name} ${u.os.version}`,
        browser: `${u.browser.name} ${u.browser.version}`,
        time: e.login_log_createTime,
        username: e.user_username,
      };
    });
  }

  /**
   * 清空表中的所有数据
   */
  async clearLoginLog(): Promise<void> {
    await this.loginLogRepository.clear();
  }

  // ------ req

  /**
   * 记录日志
   */
  async saveReqLog(
    ip: string,
    url: string,
    params: any,
    status: number,
    consumeTime: number,
    method: string | undefined,
    userId: number | null,
  ): Promise<void> {
    await this.reqLogRepository.insert({
      action: url,
      params: JSON.stringify(params),
      userId: userId === null ? undefined : userId,
      ip,
      method: method ? method.toUpperCase() : undefined,
      status,
      consumeTime,
    });
  }

  /**
   * 计算日志总数
   */
  async countReqLog(): Promise<number> {
    return await this.reqLogRepository.count();
  }

  /**
   * 分页加载日志信息
   */
  async pageGetReqLog(page: number, count: number): Promise<SysReqLog[]> {
    const result = await this.reqLogRepository.find({
      order: {
        id: 'DESC',
      },
      take: count,
      skip: page * count,
    });
    return result;
  }

  /**
   * 清空表中的所有数据
   */
  async clearReqLog(): Promise<void> {
    await this.reqLogRepository.clear();
  }

  // ---- online

  async listOnlineUser(currentUid: number): Promise<OnlineUserInfo[]> {
    const onlineUserIds: string[] = await this.redis.keys('admin:token:*');
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

  // ----- task

  /**
   * 记录任务日志
   */
  async recordTaskLog(
    tid: number,
    status: number,
    time?: number,
    err?: string,
  ): Promise<number> {
    const result = await this.taskLogRepository.save({
      taskId: tid,
      status,
      detail: err,
    });
    return result.id;
  }

  /**
   * 计算日志总数
   */
  async countTaskLog(): Promise<number> {
    return await this.taskLogRepository.count();
  }

  /**
   * 分页加载日志信息
   */
  async page(page: number, count: number): Promise<TaskLogInfo[]> {
    // const result = await this.getRepo().admin.sys.TaskLog.find({
    //   order: {
    //     id: 'DESC',
    //   },
    //   take: count,
    //   skip: page * count,
    // });
    // return result;
    const result = await this.taskLogRepository
      .createQueryBuilder('task_log')
      .leftJoinAndSelect('sys_task', 'task', 'task_log.task_id = task.id')
      .orderBy('task_log.id', 'DESC')
      .offset(page * count)
      .limit(count)
      .getRawMany();
    return result.map((e) => {
      return {
        id: e.task_log_id,
        taskId: e.task_id,
        name: e.task_name,
        createTime: e.task_log_createTime,
        consumeTime: e.task_log_consume_time,
        detail: e.task_log_detail,
        status: e.task_log_status,
      };
    });
  }

  /**
   * 清空表中的所有数据
   */
  async clearTaskLog(): Promise<void> {
    await this.taskLogRepository.clear();
  }
}
