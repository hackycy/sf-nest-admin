import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  ADMIN_PREFIX,
  NETDISK_EVENT_COPY,
  NETDISK_EVENT_CUT,
  NETDISK_EVENT_DELETE,
  NETDISK_EVENT_RENAME,
} from '../../admin.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminController } from '../../core/decorators/admin-controller.decorator';
import { NetDiskManageService } from './manage.service';
import { Body, Get, Post, Query } from '@nestjs/common';
import {
  CheckStatusDto,
  DeleteDto,
  FileInfoDto,
  FileOpDto,
  GetFileListDto,
  MarkFileDto,
  MKDirDto,
  RenameDto,
} from './manage.dto';
import {
  SFileInfoDetail,
  SFileList,
  TaskExecStatusInfo,
  TaskInfo,
  UploadToken,
} from './manage.class';
import { ApiException } from 'src/common/exceptions/api.exception';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import { IAdminUser } from '../../admin.interface';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('网盘管理模块')
@AdminController('netdisk/manage')
export class NetDiskManageController {
  constructor(
    private manageService: NetDiskManageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @ApiOperation({ summary: '获取文件列表' })
  @ApiOkResponse({ type: SFileList })
  @Get('list')
  async list(@Query() dto: GetFileListDto): Promise<SFileList> {
    return await this.manageService.getFileList(dto.path, dto.marker, dto.key);
  }

  @ApiOperation({ summary: '创建文件夹，支持多级' })
  @Post('mkdir')
  async mkdir(@Body() dto: MKDirDto): Promise<void> {
    const result = await this.manageService.checkFileExist(
      `${dto.path}${dto.dirName}/`,
    );
    if (result) {
      throw new ApiException(20001);
    }
    await this.manageService.createDir(`${dto.path}${dto.dirName}`);
  }

  @ApiOperation({ summary: '获取上传Token，无Token前端无法上传' })
  @ApiOkResponse({ type: UploadToken })
  @Get('token')
  async token(@AdminUser() user: IAdminUser): Promise<UploadToken> {
    return {
      token: this.manageService.createUploadToken(`${user.uid}`),
    };
  }

  @ApiOperation({ summary: '获取文件详细信息' })
  @ApiOkResponse({ type: SFileInfoDetail })
  @Post('info')
  async info(@Body() dto: FileInfoDto): Promise<SFileInfoDetail> {
    return await this.manageService.getFileInfo(dto.name, dto.path);
  }

  @ApiOperation({ summary: '添加文件备注' })
  @Post('mark')
  async mark(@Body() dto: MarkFileDto): Promise<void> {
    await this.manageService.changeHeaders(dto.name, dto.path, dto.mark);
  }

  @ApiOperation({ summary: '获取下载链接，不支持下载文件夹' })
  @ApiOkResponse({ type: String })
  @Post('download')
  async download(@Body() dto: FileInfoDto): Promise<string> {
    return this.manageService.getDownloadLink(`${dto.path}${dto.name}`);
  }

  @ApiOperation({ summary: '检查任务执行状态' })
  @ApiOkResponse({ type: TaskExecStatusInfo })
  @Post('check')
  async check(@Body() dto: CheckStatusDto): Promise<TaskExecStatusInfo> {
    return await this.manageService.getQiniuTaskStatus(dto.action, dto.taskId);
  }

  @ApiOperation({ summary: '重命名文件或文件夹' })
  @ApiOkResponse({ type: TaskInfo })
  @Post('rename')
  async rename(@Body() dto: RenameDto): Promise<TaskInfo> {
    const result = await this.manageService.checkFileExist(
      `${dto.path}${dto.toName}${dto.type === 'dir' ? '/' : ''}`,
    );
    if (result) {
      throw new ApiException(20001);
    }
    if (dto.type === 'file') {
      await this.manageService.renameFile(dto.path, dto.name, dto.toName);
      return {
        bgMode: false,
      };
    } else {
      const taskId = this.manageService.createQiniuBgTaskId();
      this.eventEmitter.emit(
        NETDISK_EVENT_RENAME,
        dto.path,
        dto.name,
        dto.toName,
        taskId,
      );
      return {
        bgMode: true,
        taskId,
      };
    }
  }

  @ApiOperation({ summary: '删除文件或文件夹' })
  @ApiOkResponse({ type: TaskInfo })
  @Post('delete')
  async delete(@Body() dto: DeleteDto): Promise<TaskInfo> {
    if (dto.files.length === 0 && dto.files[0].type === 'file') {
      await this.manageService.deleteFile(dto.path, dto.files[0].name);
      return {
        bgMode: false,
      };
    } else {
      const taskId = this.manageService.createQiniuBgTaskId();
      this.eventEmitter.emit(NETDISK_EVENT_DELETE, dto.files, dto.path, taskId);
      return {
        bgMode: true,
        taskId,
      };
    }
  }

  @ApiOperation({ summary: '剪切文件或文件夹，支持批量' })
  @ApiOkResponse({ type: TaskInfo })
  @Post('cut')
  async cut(@Body() dto: FileOpDto): Promise<TaskInfo> {
    if (dto.originPath === dto.toPath) {
      throw new ApiException(20002);
    }
    if (dto.files.length === 1 && dto.files[0].type === 'file') {
      await this.manageService.moveFile(
        dto.originPath,
        dto.toPath,
        dto.files[0].name,
      );
      return {
        bgMode: false,
      };
    } else {
      const taskId = this.manageService.createQiniuBgTaskId();
      this.eventEmitter.emit(
        NETDISK_EVENT_CUT,
        dto.files,
        dto.originPath,
        dto.toPath,
        taskId,
      );
      return {
        bgMode: true,
        taskId,
      };
    }
  }

  @ApiOperation({ summary: '复制文件或文件夹，支持批量' })
  @ApiOkResponse({ type: TaskInfo })
  @Post('copy')
  async copy(@Body() dto: FileOpDto): Promise<TaskInfo> {
    if (dto.files.length === 1 && dto.files[0].type === 'file') {
      await this.manageService.copyFile(
        dto.originPath,
        dto.toPath,
        dto.files[0].name,
      );
      return {
        bgMode: false,
      };
    } else {
      const taskId = this.manageService.createQiniuBgTaskId();
      this.eventEmitter.emit(
        NETDISK_EVENT_COPY,
        dto.files,
        dto.originPath,
        dto.toPath,
        taskId,
      );
      return {
        bgMode: true,
        taskId,
      };
    }
  }
}
