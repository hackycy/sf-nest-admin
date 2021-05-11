import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PageResult } from 'src/common/interfaces/res.interface';
import SysUser from 'src/entities/admin/sys-user.entity';
import { ADMIN_PREFIX } from '../../core/admin.constants';
import { IAdminUser } from '../../core/admin.interface';
import { AdminController } from '../../core/decorators/admin-controller.decorator';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import {
  CreateUserDto,
  DeleteUserDto,
  InfoUserDto,
  PageSearchUserDto,
  PasswordUserDto,
  UpdateUserDto,
} from './user.dto';
import { IPageSearchUserResult } from './user.interface';
import { SysUserService } from './user.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('管理员模块')
@AdminController('sys/user')
export class SysUserController {
  constructor(private userService: SysUserService) {}

  @ApiOperation({
    summary: '新增管理员',
  })
  @Post('add')
  async add(@Body() dto: CreateUserDto): Promise<void> {
    await this.userService.add(dto);
  }

  @ApiOperation({
    summary: '查询管理员信息',
  })
  @Get('info')
  async info(
    @Query() dto: InfoUserDto,
  ): Promise<SysUser & { roles: number[]; departmentName: string }> {
    return await this.userService.info(dto.userId);
  }

  @ApiOperation({
    summary: '根据ID列表删除管理员',
  })
  @Post('delete')
  async delete(@Body() dto: DeleteUserDto): Promise<void> {
    await this.userService.delete(dto.userIds);
    await this.userService.multiForbidden(dto.userIds);
  }

  @ApiOperation({
    summary: '分页获取管理员列表',
  })
  @Post('page')
  async page(
    @Body() dto: PageSearchUserDto,
    @AdminUser() user: IAdminUser,
  ): Promise<PageResult<IPageSearchUserResult>> {
    const list = await this.userService.page(
      user.uid,
      dto.departmentIds,
      dto.page - 1,
      dto.limit,
    );
    const total = await this.userService.count(user.uid, dto.departmentIds);
    return {
      list,
      pagination: {
        total,
        page: dto.page,
        size: dto.limit,
      },
    };
  }

  @ApiOperation({
    summary: '更新管理员信息',
  })
  @Post('update')
  async update(@Body() dto: UpdateUserDto): Promise<void> {
    await this.userService.update(dto);
    // TODO insert menu service
    // await this.menuService.refreshPerms(dto.id);
  }

  @ApiOperation({
    summary: '更改指定管理员密码',
  })
  @Post('password')
  async password(@Body() dto: PasswordUserDto): Promise<void> {
    await this.userService.forceUpdatePassword(dto.userId, dto.password);
  }
}
