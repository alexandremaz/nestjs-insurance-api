import * as z from 'zod';

export const createPartnerSchema = z.object({
  partnerName: z.string().describe('The partner name'),
});

export const createPartnerResponseSchema = z.object({
  apiKey: z.string().describe('The generated API key for the partner'),
});

export const loginResponseSchema = z.object({
  access_token: z.string().describe('The JWT access token'),
});

export type CreatePartnerDto = z.infer<typeof createPartnerSchema>;

export type CreatePartnerResponseDto = z.infer<
  typeof createPartnerResponseSchema
>;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
