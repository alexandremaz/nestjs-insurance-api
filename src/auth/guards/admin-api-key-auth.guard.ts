import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
// Guard to check if the request has the correct admin API key (env variable ADMIN_API_KEY)
@Injectable()
export class AdminApiKeyAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminApiKey = request.headers['x-admin-api-key'];
    return adminApiKey === this.configService.get<string>('ADMIN_API_KEY');
  }
}
