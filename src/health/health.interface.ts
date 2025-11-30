import { type HealthIndicatorFunction } from '@nestjs/terminus';

export interface HealthModuleOptions {
  healthIndicators: {
    isHealthy: HealthIndicatorFunction;
  }[];
}
