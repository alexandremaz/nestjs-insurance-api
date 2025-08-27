import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createCustomerPartnerPeriodSchema = z.object({
  startDate: z.iso.datetime().transform((isoString) => new Date(isoString)).describe('Start date of the period'),
  endDate: z.iso.datetime().transform((isoString) => new Date(isoString)).describe('End date of the period (optional)').optional(),
});

export class CreateCustomerPartnerPeriodDto extends createZodDto(createCustomerPartnerPeriodSchema) {};
export type CreateCustomerPartnerPeriod = z.infer<typeof createCustomerPartnerPeriodSchema>;
