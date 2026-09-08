import * as z from 'zod';
import { createCustomerSchema } from './create-customer.dto.js';

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  email: z.email().optional().describe('The email address of the customer'),
  name: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe('The full name of the customer'),
});

export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;
