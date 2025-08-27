import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPartnerSchema = z.object({
  partnerName: z.string().describe('The partner name'),
});

const createPartnerResponseSchema = z.object({
  apiKey: z.string().describe('The generated API key for the partner'),
});

const loginResponseSchema = z.object({
  access_token: z.string().describe('The JWT access token'),
});

export class CreatePartnerDto extends createZodDto(createPartnerSchema) {};
export class CreatePartnerResponseDto extends createZodDto(createPartnerResponseSchema) {};
export class LoginResponseDto extends createZodDto(loginResponseSchema) {};

export type CreatePartner = z.infer<typeof createPartnerSchema>;
export type CreatePartnerResponse = z.infer<typeof createPartnerResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
