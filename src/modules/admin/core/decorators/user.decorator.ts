import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // auth guard will mount this
    const user = request.adminUser;

    return data ? user?.[data] : user;
  },
);
