import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

import { MODULE_OPTIONS_TOKEN } from './health.module-definition.js';
import { type HealthModuleOptions } from './health.interface.js';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    @Inject(MODULE_OPTIONS_TOKEN) private options: HealthModuleOptions,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check(
      this.options.healthIndicators.map(
        (healthIndicator) => healthIndicator.isHealthy,
      ),
    );
  }
}
