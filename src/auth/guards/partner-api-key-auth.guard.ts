import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
// Guard to check if the request has a valid partner API key, and if it's valid, it stores the partner in the request
@Injectable()
export class PartnerApiKeyAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey) {
      request.partner = await this.authService.validatePartnerApiKey(apiKey);
      return true;
    }

    throw new UnauthorizedException('Missing Api Key');
  }
}
