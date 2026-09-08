import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { Partner } from './entities/partner.entity.js';
import { AdminApiKeyAuthGuard } from './guards/admin-api-key-auth.guard.js';
import { PartnerApiKeyAuthGuard } from './guards/partner-api-key-auth.guard.js';
import { JwtStrategy } from './jwt.strategy.js';
import configInjection from '../config/config-injection.js';
import assert from 'node:assert';
import { PassportModule } from '@nestjs/passport';

// Module to handle the authentication of the partners and the admin
@Global()
@Module({
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [configInjection.KEY],
      useFactory: (config: ConfigType<typeof configInjection>) => {
        assert(config.IS_MODULE_TYPEORM_ENABLED);
        return {
          secret: config.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    TypeOrmModule.forFeature([Partner]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AdminApiKeyAuthGuard,
    PartnerApiKeyAuthGuard,
  ],
})
export class AuthModule {}
