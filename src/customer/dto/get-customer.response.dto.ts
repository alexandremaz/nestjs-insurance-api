import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const claimSchema = z.object({
  pointValue: z.number(),
});

const customerWithClaimsSchema = z.object({
  id: z.number().int().positive().describe('Unique customer identifier'),
  email: z.email().describe('Customer email address'),
  name: z.string().min(1).describe('Customer name'),
  claims: z.array(claimSchema).default([]),
});

export const customerResponseSchema = customerWithClaimsSchema.transform(
  ({ id, email, name, claims }) => ({
    id,
    email,
    name,
    totalPoints: claims.reduce((sum, c) => sum + c.pointValue, 0),
  }),
);

export class CustomerResponseDto extends createZodDto(customerResponseSchema) {}

export type CustomerResponse = z.infer<typeof customerResponseSchema>;
