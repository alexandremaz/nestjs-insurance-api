import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ElasticHealthIndicator } from '../elastic-health-indicator/elastic-health-indicator';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: Logger,
    }),
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [ElasticHealthIndicator, Logger],
})
export class HealthModule {}
