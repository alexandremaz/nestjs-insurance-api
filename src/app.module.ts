import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClaimModule } from './claim/claim.module';
import { CustomerModule } from './customer/customer.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { MichelinSearchModule } from './michelin-search/michelin-search.module';
import { HealthModule } from './health/health.module';
import { HealthIndicatorService } from '@nestjs/terminus';
import { ElasticSearchHealthIndicator } from './elastic-search.health-indicator';
import { HttpService } from '@nestjs/axios';
import configInjection from './config/config-injection';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configInjection],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [configInjection.KEY],
      useFactory: ({
        database: {
          DATABASE_HOST: host,
          DATABASE_NAME: name,
          DATABASE_PORT: port,
          DATABASE_PASSWORD: password,
          DATABASE_TYPE: type,
          DATABASE_USER: user,
        },
      }: ConfigType<typeof configInjection>) => ({
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        migrations: [`${__dirname}/migrations/*{.ts,.js}`],
        synchronize: true,
        type,
        url: `postgresql://${user}:${password}@${host}:${port}/${name}`,
      }),
    }),
    CustomerModule,
    ClaimModule,
    AuthModule,
    MichelinSearchModule,
    HealthModule.registerAsync({
      inject: [
        HealthIndicatorService,
        HttpService,
        Logger,
        configInjection.KEY,
      ],
      useFactory(
        healthIndicatorService: HealthIndicatorService,
        httpService: HttpService,
        logger: Logger,
        config: ConfigType<typeof configInjection>,
      ) {
        return {
          healthIndicators: [
            new ElasticSearchHealthIndicator(
              healthIndicatorService,
              httpService,
              logger,
              config,
            ),
          ],
        };
      },
    }),
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
