import { SetMetadata } from '@nestjs/common';
import { NO_LOG_KEY_METADATA } from '../../../../common/contants/admin.constants';

export const NoLog = () => SetMetadata(NO_LOG_KEY_METADATA, true);
