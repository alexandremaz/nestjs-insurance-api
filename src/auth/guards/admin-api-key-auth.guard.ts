import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { Request } from 'express';
import configInjection from '../../config/config-injection';
@Injectable()
export class AdminApiKeyAuthGuard implements CanActivate {
  constructor(
    @Inject(configInjection.KEY)
    private readonly config: ConfigType<typeof configInjection>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminApiKey = request.headers['x-admin-api-key'];
    return adminApiKey === this.config.ADMIN_API_KEY;
  }
}
