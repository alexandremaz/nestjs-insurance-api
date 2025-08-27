import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1).describe('The full name of the customer'),
  email: z.email().describe('The email address of the customer'),
});

export class CreateCustomerDto extends createZodDto(createCustomerSchema) {}

export type CreateCustomer = z.infer<typeof createCustomerSchema>;
