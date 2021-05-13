import { ApiProperty } from '@nestjs/swagger';

export type FileType = 'file' | 'dir';

export class SFileInfo {
  @ApiProperty({ description: '文件id' })
  id: string;

  @ApiProperty({ description: '文件类型', enum: ['file', 'dir'] })
  type: FileType;

  @ApiProperty({ description: '文件名称' })
  name: string;

  @ApiProperty({ description: '存入时间', type: Date })
  putTime?: Date;

  @ApiProperty({ description: '文件大小, byte单位' })
  fsize?: string;

  @ApiProperty({ description: '文件的mime-type' })
  mimeType?: string;
}

export class SFileList {
  @ApiProperty({ description: '文件列表', type: [SFileInfo] })
  list: SFileInfo[];

  @ApiProperty({ description: '分页标志，空则代表加载完毕' })
  marker?: string;
}

export class TaskExecStatusInfo {
  @ApiProperty({ description: '执行状态' })
  status: number;

  @ApiProperty({ description: '错误信息' })
  err?: string;
}

export class UploadToken {
  @ApiProperty({ description: '上传token' })
  token: string;
}
