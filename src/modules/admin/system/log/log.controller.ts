import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageResult } from 'src/common/class/res.class';
import { PageOptionsDto } from 'src/common/dto/page.dto';
import { ApiException } from 'src/common/exceptions/api.exception';
import SysReqLog from 'src/entities/admin/sys-req-log.entity';
import { IAdminUser } from '../../admin.interface';
import { AdminController } from '../../core/decorators/admin-controller.decorator';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import { NoLog } from '../../core/decorators/no-log.decorator';
import { SysUserService } from '../user/user.service';
import { LoginLogInfo, OnlineUserInfo, TaskLogInfo } from './log.class';
import { KickDto } from './log.dto';
import { SysLogService } from './log.service';

@ApiTags('日志模块')
@AdminController('sys')
export class SysLogController {
  constructor(
    private logService: SysLogService,
    private userService: SysUserService,
  ) {}

  @ApiOperation({ summary: '分页查询登录日志' })
  @ApiOkResponse({ type: [LoginLogInfo] })
  @NoLog()
  @Get('log/login/page')
  async loginLogPage(
    @Query() dto: PageOptionsDto,
  ): Promise<PageResult<LoginLogInfo>> {
    const list = await this.logService.pageGetLoginLog(dto.page - 1, dto.limit);
    const count = await this.logService.countLoginLog();
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }

  @ApiOperation({ summary: '分页查询请求追踪日志' })
  @ApiOkResponse({ type: [SysReqLog] })
  @NoLog()
  @Get('log/req/page')
  async reqPage(@Query() dto: PageOptionsDto): Promise<PageResult<SysReqLog>> {
    const list = await this.logService.pageGetReqLog(dto.page - 1, dto.limit);
    const count = await this.logService.countReqLog();
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }

  @ApiOperation({ summary: '分页查询任务日志' })
  @ApiOkResponse({ type: [TaskLogInfo] })
  @NoLog()
  @Get('log/task/page')
  async taskPage(
    @Query() dto: PageOptionsDto,
  ): Promise<PageResult<TaskLogInfo>> {
    const list = await this.logService.page(dto.page - 1, dto.limit);
    const count = await this.logService.countTaskLog();
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }

  @ApiOperation({ summary: '查询当前在线用户' })
  @ApiOkResponse({ type: [OnlineUserInfo] })
  @NoLog()
  @Get('online/list')
  async list(@AdminUser() user: IAdminUser): Promise<OnlineUserInfo[]> {
    return await this.logService.listOnlineUser(user.uid);
  }

  @ApiOperation({ summary: '下线指定在线用户' })
  @Post('online/kick')
  async kick(
    @Body() dto: KickDto,
    @AdminUser() user: IAdminUser,
  ): Promise<void> {
    if (dto.id === user.uid) {
      throw new ApiException(10012);
    }
    const rootUserId = await this.userService.findRootUserId();
    if (dto.id === rootUserId) {
      throw new ApiException(10013);
    }
    await this.userService.forbidden(dto.id);
  }
}
