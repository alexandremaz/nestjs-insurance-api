import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { Partner } from '../entities/partner.entity';

// Decorator to get the partner from the request
export const GetPartner = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { partner: Partner }>();
    return request.partner;
  },
);
