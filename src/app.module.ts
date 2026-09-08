import {
  Logger,
  Module,
  StandardSchemaSerializerInterceptor,
  StandardSchemaValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigType, ConditionalModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ClaimModule } from './claim/claim.module.js';
import { CustomerModule } from './customer/customer.module.js';
import { MichelinSearchModule } from './michelin-search/michelin-search.module.js';
import { HealthModule } from './health/health.module.js';
import { HealthIndicatorService } from '@nestjs/terminus';
import { ElasticSearchHealthIndicator } from './elastic-search.health-indicator.js';
import { HttpService } from '@nestjs/axios';
import configInjection from './config/config-injection.js';
import assert from 'node:assert';
const __dirname = import.meta.dirname;

@Module({
  controllers: [AppController],
  imports: [
    // DevtoolsModule.register({
    //   http: process.env.NODE_ENV !== 'production',
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configInjection],
    }),
    ConditionalModule.registerWhen(AuthModule, 'IS_MODULE_AUTH_ENABLED'),
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
            autoLoadEntities: true,
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
          healthIndicators: config.IS_MODULE_ELASTIC_ENABLED
            ? [
                new ElasticSearchHealthIndicator(
                  healthIndicatorService,
                  httpService,
                  logger,
                  config,
                ),
              ]
            : [],
        };
      },
    }),
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new StandardSchemaValidationPipe({
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardSchemaSerializerInterceptor,
    },
    // TODO : see if an app filter is still necessary {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}
