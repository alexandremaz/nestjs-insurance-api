import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType, ConditionalModule } from '@nestjs/config';
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
import assert from 'node:assert';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configInjection],
    }),
    ConditionalModule.registerWhen(
      TypeOrmModule.forRootAsync({
        inject: [configInjection.KEY],
        useFactory: (config: ConfigType<typeof configInjection>) => {
          assert(config.IS_MODULE_TYPEORM_ENABLED);
          const {
            DATABASE_HOST: host,
            DATABASE_NAME: name,
            DATABASE_PASSWORD: password,
            DATABASE_USER: user,
            DATABASE_PORT: port,
            DATABASE_TYPE: type,
          } = config;
          return {
            entities: [`${__dirname}/**/*.entity{.ts,.js}`],
            migrations: [`${__dirname}/migrations/*{.ts,.js}`],
            synchronize: true,
            type,
            url: `postgresql://${user}:${password}@${host}:${port}/${name}`,
          };
        },
      }),
      'IS_MODULE_TYPEORM_ENABLED',
    ),
    ConditionalModule.registerWhen(
      CustomerModule,
      'IS_MODULE_CUSTOMER_ENABLED',
    ),
    ConditionalModule.registerWhen(ClaimModule, 'IS_MODULE_CLAIM_ENABLED'),
    ConditionalModule.registerWhen(AuthModule, 'IS_MODULE_AUTH_ENABLED'),
    ConditionalModule.registerWhen(
      MichelinSearchModule,
      'IS_MODULE_MICHELIN_ENABLED',
    ),
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
            ...(config.IS_MODULE_ELASTIC_ENABLED
              ? [
                  new ElasticSearchHealthIndicator(
                    healthIndicatorService,
                    httpService,
                    logger,
                    config,
                  ),
                ]
              : []),
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
