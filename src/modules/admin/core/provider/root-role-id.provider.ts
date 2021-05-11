import { FactoryProvider } from '@nestjs/common';
import { ROOT_ROLE_ID } from 'src/common/contants/admin.constants';
import { UtilService } from 'src/shared/services/util.service';

/**
 * 提供使用 @Inject(ROOT_ROLE_ID) 直接获取RootRoleId
 */
export function rootRoleIdProvider(): FactoryProvider {
  return {
    provide: ROOT_ROLE_ID,
    useFactory: (util: UtilService) => {
      return util.getRootRoleId();
    },
    inject: [UtilService],
  };
}
