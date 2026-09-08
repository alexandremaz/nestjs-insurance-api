import * as z from 'zod';

export const searchQueryParamsSchema = z.object({
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

export type SearchQueryParamsDto = z.infer<typeof searchQueryParamsSchema>;
