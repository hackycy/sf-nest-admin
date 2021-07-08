import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/common/exceptions/api.exception';
import { IAdminUser } from '../../admin.interface';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import { LogDisabled } from '../../core/decorators/log-disabled.decorator';
import { SysUserService } from '../user/user.service';
import { OnlineUserInfo } from './online.class';
import { KickDto } from './online.dto';
import { SysOnlineService } from './online.service';

@ApiTags('在线用户模块')
@Controller('online')
export class SysOnlineController {
  constructor(
    private userService: SysUserService,
    private onlineService: SysOnlineService,
  ) {}

  @ApiOperation({ summary: '查询当前在线用户' })
  @ApiOkResponse({ type: [OnlineUserInfo] })
  @LogDisabled()
  @Get('list')
  async list(@AdminUser() user: IAdminUser): Promise<OnlineUserInfo[]> {
    return await this.onlineService.listOnlineUser(user.uid);
  }

  @ApiOperation({ summary: '下线指定在线用户' })
  @Post('kick')
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
