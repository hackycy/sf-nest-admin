import { applyDecorators, Controller } from '@nestjs/common';
import { ADMIN_PREFIX } from '../../../../common/contants/admin.constants';

/**
 * 自动加入admin/前缀路由的Controller注解
 */
export function AdminController(prefix: string) {
  return applyDecorators(Controller(`${ADMIN_PREFIX}/${prefix}`));
}
