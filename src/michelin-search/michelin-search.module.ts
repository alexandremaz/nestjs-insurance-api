import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import type { ConfigType } from '@nestjs/config';
import { MichelinSearchController } from './michelin-search.controller';
import { MichelinSearchService } from './michelin-search.service';
import configInjection from '../config/config-injection';

@Module({
  controllers: [MichelinSearchController],
  imports: [
    ElasticsearchModule.registerAsync({
      inject: [configInjection.KEY],
      useFactory({
        elastic: { ELASTIC_HOST: host, ELASTIC_PORT: port },
      }: ConfigType<typeof configInjection>) {
        return {
          node: `http://${host}:${port}`,
        };
      },
    }),
  ],
  providers: [MichelinSearchService],
})
export class MichelinSearchModule {}
