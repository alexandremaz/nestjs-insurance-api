import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthService } from '../auth.service';
import type { Partner } from '../entities/partner.entity';
// Guard to check if the request has a valid partner API key, and if it's valid, it stores the partner in the request
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
