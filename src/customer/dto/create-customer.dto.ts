import * as z from 'zod';

export const createCustomerSchema = z.object({
  email: z.email().describe('The email address of the customer'),
  name: z.string().trim().min(1).describe('The full name of the customer'),
});

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
