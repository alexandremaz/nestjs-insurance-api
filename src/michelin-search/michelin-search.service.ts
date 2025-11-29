import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MichelinSearchService {
  index = 'michelin';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search({ city, cuisine }: { city: string; cuisine: string }) {
    const restaurants = await this.elasticsearchService.search({
      index: this.index,
      query: {
        bool: {
          must: [
            {
              match: {
                cuisine,
              },
            },
            {
              match_phrase: {
                city,
              },
            },
          ],
        },
      },
    });

    return restaurants.hits.hits;
  }
}
