import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const documentQueryParamsSchema = z.object({
  origin: z.string().nonempty(),
  originId: z.string().nonempty(),
});

export class DocumentQueryParamsDto extends createZodDto(
  documentQueryParamsSchema,
) {}

export type DocumentQueryParams = z.infer<typeof documentQueryParamsSchema>;

export const documentResponseSchema = z.object({
  message: z.string().nonempty(),
});

export class DocumentResponseDto extends createZodDto(documentResponseSchema) {}
