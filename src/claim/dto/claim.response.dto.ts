import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const claimResponseSchema = z.object({
  id: z.number().int().positive().describe('The claim ID'),
  title: z.string().min(1).describe('The title of the claim'),
  description: z.string().describe('Detailed description of the claim'),
  pointValue: z.number().int().nonnegative().describe('Point value of the claim'),
  customer: z.object({
    id: z.number().int().positive().describe('The ID of the customer this claim belongs to')
  }),
}).transform(({ customer, ...rest }) => ({
  ...rest,
  customerId: customer.id,
}));

export class ClaimResponseDto extends createZodDto(claimResponseSchema) {}

export type ClaimResponse = z.infer<typeof claimResponseSchema>;  
