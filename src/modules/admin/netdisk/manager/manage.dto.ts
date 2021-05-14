import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty } from 'lodash';

@ValidatorConstraint({ name: 'IsLegalDirExpression', async: false })
export class IsLegalDirExpression implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: string, args: ValidationArguments) {
    try {
      if (isEmpty(value)) {
        throw new Error('dir name is empty');
      }
      if (value.startsWith('/')) {
        throw new Error('dir name not allow / start');
      }
      if (/([\\/])\1/.test(value)) {
        throw new Error('// this is not allow');
      }
      if (value.endsWith('/')) {
        throw new Error('dir name not allow / end');
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'dir name invalid invalid';
  }
}

export class GetFileListDto {
  @ApiProperty({ description: '分页标识' })
  @IsOptional()
  @IsString()
  marker: string;

  @ApiProperty({ description: '当前路径' })
  @IsString()
  path: string;

  @ApiPropertyOptional({ description: '搜索关键字' })
  @IsString()
  @IsOptional()
  key: string;
}

export class MKDirDto {
  @ApiProperty({ description: '文件夹名称' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsLegalDirExpression)
  dirName: string;
}

export class RenameDto {
  @ApiProperty({ description: '文件类型' })
  @IsString()
  @Matches(/(^file$)|(^dir$)/)
  type: string;

  @ApiProperty({ description: '更改的名称' })
  @IsString()
  @IsNotEmpty()
  toName: string;

  @ApiProperty({ description: '原来的名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '路径' })
  @IsString()
  path: string;
}

export class DownloadDto {
  @ApiProperty({ description: '文件名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '文件所在路径' })
  @IsString()
  path: string;
}

export class DeleteDto {
  @ApiProperty({ description: '文件类型' })
  @IsString()
  @Matches(/(^file$)|(^dir$)/)
  type: string;

  @ApiProperty({ description: '文件名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '文件/文件夹所在路径' })
  @IsString()
  path: string;
}

export class CheckStatusDto {
  @ApiProperty({ description: '队列Action' })
  @IsString()
  @Matches(/(^rename$)|(^delete$)/)
  action: string;

  @ApiProperty({ description: '文件/文件夹名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '文件/文件夹所在路径' })
  @IsString()
  path: string;
}
