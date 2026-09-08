import z from 'zod';

export const createCustomerPartnerPeriodSchema = z.object({
  endDate: z.iso
    .datetime()
    .transform((isoString) => new Date(isoString))
    .describe('End date of the period (optional)')
    .optional(),
  startDate: z.iso
    .datetime()
    .transform((isoString) => new Date(isoString))
    .describe('Start date of the period'),
});

export type CreateCustomerPartnerPeriodDto = z.infer<
  typeof createCustomerPartnerPeriodSchema
>;
