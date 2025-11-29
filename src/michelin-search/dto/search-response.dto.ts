import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const searchResponse = z
  .array(
    z.object({
      _index: z.literal('michelin'),
      _source: z.object({
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
        region: z
          .string()
          .trim()
          .min(1)
          .describe('Region of the restaurants we are looking for'),
      }),
    }),
  )
  .transform((array) => array.map((element) => ({ ...element._source })));

export class SearchResponseDto extends createZodDto(searchResponse) {}
