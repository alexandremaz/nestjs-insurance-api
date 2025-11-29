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
        name: z
          .string()
          .trim()
          .min(1)
          .describe('Name of the restaurants we are looking for'),
        year: z
          .string()
          .trim()
          .min(1)
          .describe('Year of the restaurants we are looking for'),
        zipCode: z
          .string()
          .trim()
          .min(1)
          .describe('ZipCode of the restaurants we are looking for'),
        pin: z.object({
          location: z.object({
            lat: z
              .string()
              .trim()
              .min(1)
              .describe('Latitude of the restaurants we are looking for'),
            lon: z
              .string()
              .trim()
              .min(1)
              .describe('Longitude of the restaurants we are looking for'),
          }),
        }),
        url: z.url().describe('URL of the restaurants we are looking for'),
        star: z
          .string()
          .trim()
          .min(1)
          .describe('Star of the restaurants we are looking for'),
        price: z
          .string()
          .trim()
          .min(1)
          .describe('Price of the restaurants we are looking for'),
      }),
    }),
  )
  .transform((array) => array.map((element) => ({ ...element._source })));

export class SearchResponseDto extends createZodDto(searchResponse) {}
