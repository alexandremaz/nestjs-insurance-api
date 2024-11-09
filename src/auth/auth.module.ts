import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Partner } from './entities/partner.entity';
import { JwtStrategy } from './jwt.strategy';
import { AdminApiKeyAuthGuard } from './guards/admin-api-key-auth.guard';
import { PartnerApiKeyAuthGuard } from './guards/partner-api-key-auth.guard';

// Module to handle the authentication of the partners and the admin
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([Partner]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    AdminApiKeyAuthGuard,
    PartnerApiKeyAuthGuard,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
