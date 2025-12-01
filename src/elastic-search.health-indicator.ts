import { Inject, Injectable, Logger } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';
import configInjection from './config/config-injection';
import type { ConfigType } from '@nestjs/config';
import assert from 'node:assert';

@Injectable()
export class ElasticSearchHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
    @Inject(configInjection.KEY)
    private readonly config: ConfigType<typeof configInjection>,
  ) {}

  async isHealthy() {
    const indicator = this.healthIndicatorService.check('elastic-search');
    assert(this.config.IS_MODULE_ELASTIC_ENABLED);
    const { ELASTIC_HOST: host, ELASTIC_PORT: port } = this.config;
    try {
      const {
        status,
        data: { status: clusterStatus },
      } = await this.httpService.axiosRef.get<{
        status: 'green' | 'red' | 'yellow';
      }>(`http://${host}:${port}/_cluster/health`);

      if (!(status === 200 && clusterStatus === 'green')) {
        return indicator.down({ clusterStatus });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        this.logger.error({
          cause: error.cause,
          message: error.message,
          status: error.status,
        });
      }

      return indicator.down();
    }

    return indicator.up();
  }
}
