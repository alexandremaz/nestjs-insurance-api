import * as z from 'zod';
import { createClaimSchema } from './create-claim.dto.js';

export const batchCreateClaimsSchema = z.object({
  claims: z
    .array(createClaimSchema)
    .min(1, 'At least one claim is required')
    .describe('Array of claims to create'),
});

export type BatchCreateClaimsDto = z.infer<typeof batchCreateClaimsSchema>;
