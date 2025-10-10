import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
// Strategy to validate the JWT token of a partner
export class JwtStrategy extends PassportStrategy(Strategy) {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: NestJS constructor injection
  constructor(private configService: ConfigService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: { name: string; sub: number }) {
    return { id: payload.sub, name: payload.name };
  }
}
