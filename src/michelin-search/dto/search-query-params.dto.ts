import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const searchQueryParams = z.object({
  city: z
    .string()
    .trim()
    .min(1)
    .describe('City of the restaurants we are looking for'),
  cuisine: z
    .string()
    .trim()
    .min(1)
    .describe('Cuisine of the restaurants we are looking for'),
});

export class SearchQueryParamsDto extends createZodDto(searchQueryParams) {}
