import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configInjection from '../config/config-injection';
import assert from 'node:assert';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(configInjection.KEY)
    config: ConfigType<typeof configInjection>,
  ) {
    assert(config.IS_MODULE_AUTH_ENABLED);
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_SECRET,
    });
  }

  validate(payload: { name: string; sub: number }) {
    return { id: payload.sub, name: payload.name };
  }
}
