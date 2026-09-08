import * as z from 'zod';

export const createClaimSchema = z.object({
  description: z.string().trim().describe('Detailed description of the claim'),
  pointValue: z
    .number()
    .int()
    .nonnegative()
    .describe('Point value of the claim'),
  title: z.string().trim().min(1).describe('The title of the claim'),
});

export type CreateClaimDto = z.infer<typeof createClaimSchema>;
