import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createCustomerResponseSchema = z.object({
  email: z.email().describe('The customer email address'),
  id: z.number().int().positive().describe('The customer ID'),
  name: z.string().min(1).describe('The customer full name'),
});

export class CreateCustomerResponseDto extends createZodDto(
  createCustomerResponseSchema,
) {}

export type CreateCustomerResponse = z.infer<
  typeof createCustomerResponseSchema
>;
