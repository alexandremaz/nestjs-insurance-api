import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import type { ConfigType } from '@nestjs/config';
import { MichelinSearchController } from './michelin-search.controller';
import { MichelinSearchService } from './michelin-search.service';
import configInjection from '../config/config-injection';
import assert from 'node:assert';

@Module({
  controllers: [MichelinSearchController],
  imports: [
    ElasticsearchModule.registerAsync({
      inject: [configInjection.KEY],
      useFactory(config: ConfigType<typeof configInjection>) {
        assert(config.IS_MODULE_MICHELIN_ENABLED);
        const { ELASTIC_HOST: host, ELASTIC_PORT: port } = config;
        return {
          node: `http://${host}:${port}`,
        };
      },
    }),
  ],
  providers: [MichelinSearchService],
})
export class MichelinSearchModule {}
