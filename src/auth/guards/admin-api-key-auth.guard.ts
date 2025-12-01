import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { Request } from 'express';
import configInjection from '../../config/config-injection';
import assert from 'node:assert';
@Injectable()
export class AdminApiKeyAuthGuard implements CanActivate {
  constructor(
    @Inject(configInjection.KEY)
    private readonly config: ConfigType<typeof configInjection>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminApiKey = request.headers['x-admin-api-key'];
    assert(this.config.IS_MODULE_TYPEORM_ENABLED);
    return adminApiKey === this.config.ADMIN_API_KEY;
  }
}
