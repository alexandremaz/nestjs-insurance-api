import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { createClaimSchema } from './create-claim.dto';

const batchCreateClaimsSchema = z.object({
  claims: z
    .array(createClaimSchema)
    .min(1, 'At least one claim is required')
    .describe('Array of claims to create'),
});

export class BatchCreateClaimDto extends createZodDto(batchCreateClaimsSchema) {}

export type BatchCreateClaims = z.infer<typeof batchCreateClaimsSchema>;
