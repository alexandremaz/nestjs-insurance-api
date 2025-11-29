import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
@Injectable()
export class AdminApiKeyAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminApiKey = request.headers['x-admin-api-key'];
    return adminApiKey === this.configService.get<string>('ADMIN_API_KEY');
  }
}
