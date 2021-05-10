import { SetMetadata } from '@nestjs/common';
import { OPEN_KEY_METADATA } from '../admin.constants';

export const Open = () => SetMetadata(OPEN_KEY_METADATA, true);
