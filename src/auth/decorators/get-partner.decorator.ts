import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorator to get the partner from the request
export const GetPartner = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.partner;
  },
);
