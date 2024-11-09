import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard to check if the request has a valid JWT token (used to authenticate a partner)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
