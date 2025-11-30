import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Partner } from './entities/partner.entity';
import { AdminApiKeyAuthGuard } from './guards/admin-api-key-auth.guard';
import { PartnerApiKeyAuthGuard } from './guards/partner-api-key-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import configInjection from '../config/config-injection';

// Module to handle the authentication of the partners and the admin
@Module({
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [configInjection.KEY],
      useFactory: (config: ConfigType<typeof configInjection>) => ({
        secret: config.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
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
