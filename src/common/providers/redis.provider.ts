import { CACHE_MANAGER, FactoryProvider } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { REDIS_INSTANCE } from '../contants/common.contants';

export function redisProvider(): FactoryProvider {
  return {
    provide: REDIS_INSTANCE,
    useFactory: (cacheManager: Cache) => {
      return (cacheManager.store as any).getClient();
    },
    inject: [CACHE_MANAGER],
  };
}
