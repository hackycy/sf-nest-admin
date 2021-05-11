import { Global, Module } from '@nestjs/common';
import { UtilProvider } from './util.provider';

@Global()
@Module({
  providers: [UtilProvider],
  exports: [UtilProvider],
})
export class UtilModule {}
