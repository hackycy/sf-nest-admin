import { applyDecorators, Controller } from '@nestjs/common';
import { ADMIN_PREFIX } from '../admin.constants';

export function AdminController(prefix: string) {
  return applyDecorators(Controller(`${ADMIN_PREFIX}/${prefix}`));
}
