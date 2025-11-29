import { Injectable, Logger } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';

@Injectable()
export class ElasticHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);
    try {
      const {
        status,
        data: { status: clusterStatus },
      } = await this.httpService.axiosRef.get<{
        status: 'green' | 'red' | 'yellow';
      }>('http://localhost:9200/_cluster/health');

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
