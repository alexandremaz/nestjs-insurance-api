import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import type { Partner } from '../entities/partner.entity';
import { Request } from 'express';
@Injectable()
export class PartnerApiKeyAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { partner: Partner }>();
    const apiKey = request.headers['x-api-key'];

    if (apiKey && typeof apiKey === 'string') {
      request.partner = await this.authService.validatePartnerApiKey(apiKey);
      return true;
    }

    throw new UnauthorizedException('Missing Api Key');
  }
}
