import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SysLoginLog from 'src/entities/admin/sys-login-log.entity';
import SysReqLog from 'src/entities/admin/sys-req-log.entity';
import SysTaskLog from 'src/entities/admin/sys-task-log.entity';
import { Repository } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import { LoginLogInfo, TaskLogInfo } from './log.class';

@Injectable()
export class SysLogService {
  constructor(
    @InjectRepository(SysLoginLog)
    private loginLogRepository: Repository<SysLoginLog>,
    @InjectRepository(SysReqLog)
    private reqLogRepository: Repository<SysReqLog>,
    @InjectRepository(SysTaskLog)
    private taskLogRepository: Repository<SysTaskLog>,
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
