import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { createCustomerSchema } from './create-customer.dto';

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  name: z.string().trim().min(1).optional().describe('The full name of the customer'),
  email: z.email().optional().describe('The email address of the customer'),
});

export class UpdateCustomerDto extends createZodDto(updateCustomerSchema) {}

export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
