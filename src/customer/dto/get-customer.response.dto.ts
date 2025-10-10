import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const claimSchema = z.object({
  pointValue: z.number(),
});

const customerWithClaimsSchema = z.object({
  claims: z.array(claimSchema).default([]),
  email: z.email().describe('Customer email address'),
  id: z.number().int().positive().describe('Unique customer identifier'),
  name: z.string().min(1).describe('Customer name'),
});

export const customerResponseSchema = customerWithClaimsSchema.transform(
  ({ id, email, name, claims }) => ({
    email,
    id,
    name,
    totalPoints: claims.reduce((sum, c) => sum + c.pointValue, 0),
  }),
);

export class CustomerResponseDto extends createZodDto(customerResponseSchema) {}

export type CustomerResponse = z.infer<typeof customerResponseSchema>;
