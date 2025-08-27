import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Decorator to get the partner from the request
export const GetPartner = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request['partner'];
  },
);
