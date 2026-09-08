import { Controller, Get, Query, SerializeOptions } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  searchQueryParamsSchema,
  type SearchQueryParamsDto,
} from './dto/search-query-params.dto.js';
import { searchResponseSchema } from './dto/search-response.dto.js';
import { MichelinSearchService } from './michelin-search.service.js';

@Controller('michelin-search')
export class MichelinSearchController {
  constructor(private readonly michelinSearchService: MichelinSearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search restaurants by city/cuisine' })
  @ApiResponse({
    description: 'Restaurants matching search query',
    status: 200,
    // TODO : fix schema
  })
  // TODO : fix that later @SerializeOptions({ schema: searchResponseSchema }), for the moment serialize in the controller method (a bit custom)
  async findOne(
    @Query({ schema: searchQueryParamsSchema })
    { city, cuisine }: SearchQueryParamsDto,
  ) {
    console.log({ city, cuisine });

    const restaurants = await this.michelinSearchService.search({
      city,
      cuisine,
    });

    const transformedRestaurants = searchResponseSchema.parse(restaurants);

    console.log(transformedRestaurants);

    return transformedRestaurants;
  }
}
