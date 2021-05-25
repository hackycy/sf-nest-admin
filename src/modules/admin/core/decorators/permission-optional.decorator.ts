import { SetMetadata } from '@nestjs/common';
import { PERMISSION_OPTIONAL_KEY_METADATA } from '../../admin.constants';

export const PermissionOptional = () =>
  SetMetadata(PERMISSION_OPTIONAL_KEY_METADATA, true);
