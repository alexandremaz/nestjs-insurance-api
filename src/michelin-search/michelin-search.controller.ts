import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { SearchQueryParamsDto } from './dto/search-query-params.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { MichelinSearchService } from './michelin-search.service';

@Controller('michelin-search')
export class MichelinSearchController {
  constructor(private readonly michelinSearchService: MichelinSearchService) {}

  @Get()
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
