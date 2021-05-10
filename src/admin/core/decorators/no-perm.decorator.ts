import { SetMetadata } from '@nestjs/common';
import { NO_PERM_KEY_METADATA } from '../admin.constants';

export const NoPerm = () => SetMetadata(NO_PERM_KEY_METADATA, true);
