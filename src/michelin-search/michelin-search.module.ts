import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MichelinSearchController } from './michelin-search.controller';
import { MichelinSearchService } from './michelin-search.service';

@Module({
  controllers: [MichelinSearchController],
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  providers: [MichelinSearchService],
})
export class MichelinSearchModule {}
