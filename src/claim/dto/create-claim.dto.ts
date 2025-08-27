import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createClaimSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .describe('The title of the claim'),
  description: z
    .string()
    .trim()
    .describe('Detailed description of the claim'),
  pointValue: z
    .number()
    .int()
    .nonnegative()
    .describe('Point value of the claim'),
});

export class CreateClaimDto extends createZodDto(createClaimSchema) {}

export type CreateClaim = z.infer<typeof createClaimSchema>;
