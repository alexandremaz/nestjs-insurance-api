import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { ElasticHealthIndicator } from '../elastic-health-indicator/elastic-health-indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private elasticHealthIndicator: ElasticHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.elasticHealthIndicator.isHealthy('elastic-health'),
    ]);
  }
}
