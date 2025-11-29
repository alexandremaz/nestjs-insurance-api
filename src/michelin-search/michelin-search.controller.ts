import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { SearchQueryParamsDto } from './dto/search-query-params.dto';
import { SearchResponseDto } from './dto/search-response.dto';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { MichelinSearchService } from './michelin-search.service';

@Controller('michelin-search')
export class MichelinSearchController {
  constructor(private readonly michelinSearchService: MichelinSearchService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Search restaurants by city/cuisine' })
  @ApiResponse({
    description: 'Restaurants matching search query',
    status: 200,
    type: SearchResponseDto,
  })
  @ZodSerializerDto(SearchResponseDto)
  async findOne(@Query() { city, cuisine }: SearchQueryParamsDto) {
    const restaurants = await this.michelinSearchService.search({
      city,
      cuisine,
    });
    return restaurants;
  }
}
