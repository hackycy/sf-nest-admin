import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('参数配置模块')
@Controller('param-config')
export class SysParamConfigController {}
