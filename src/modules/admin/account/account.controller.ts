import { Body, Get, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ADMIN_PREFIX } from 'src/common/contants/admin.constants';
import { IAdminUser } from '../admin.interface';
import { AdminController } from '../core/decorators/admin-controller.decorator';
import { AdminUser } from '../core/decorators/admin-user.decorator';
import { NoPerm } from '../core/decorators/no-perm.decorator';
import { PermMenuInfo } from '../login/login.class';
import { LoginService } from '../login/login.service';
import { AccountInfo } from '../system/user/user.class';
import { UpdatePasswordDto } from '../system/user/user.dto';
import { SysUserService } from '../system/user/user.service';
import { UpdatePersonInfoDto } from './account.dto';

@ApiTags('账户模块')
@ApiSecurity(ADMIN_PREFIX)
@NoPerm()
@AdminController('account')
export class AccountController {
  constructor(
    private userService: SysUserService,
    private loginService: LoginService,
  ) {}

  @ApiOperation({ summary: '获取管理员资料' })
  @ApiOkResponse({ type: AccountInfo })
  @Get('info')
  async info(@AdminUser() user: IAdminUser): Promise<AccountInfo> {
    return await this.userService.getAccountInfo(user.uid);
  }

  @ApiOperation({ summary: '更改管理员资料' })
  @Post('update')
  async update(
    @Body() dto: UpdatePersonInfoDto,
    @AdminUser() user: IAdminUser,
  ): Promise<void> {
    await this.userService.updatePersonInfo(user.uid, dto);
  }

  @ApiOperation({ summary: '更改管理员密码' })
  @Post('password')
  async password(
    @Body() dto: UpdatePasswordDto,
    @AdminUser() user: IAdminUser,
  ): Promise<void> {
    await this.userService.updatePassword(user.uid, dto);
  }

  @ApiOperation({ summary: '管理员登出' })
  @Post('logout')
  async logout(@AdminUser() user: IAdminUser): Promise<void> {
    await this.loginService.clearLoginStatus(user.uid);
  }

  @ApiOperation({ summary: '获取菜单列表及权限列表' })
  @ApiOkResponse({ type: PermMenuInfo })
  @Get('permmenu')
  async permmenu(@AdminUser() user: IAdminUser): Promise<PermMenuInfo> {
    return await this.loginService.getPermMenu(user.uid);
  }
}
