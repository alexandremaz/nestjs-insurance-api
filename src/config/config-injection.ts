import { registerAs } from '@nestjs/config';
import * as z from 'zod';

export function validateEnvWithZod<T>({
  schema,
  value,
}: {
  schema: z.ZodType<T>;
  value: Record<string, unknown>;
}): T {
  const safeParseResult = schema.safeParse(value);

  if (!safeParseResult.success) {
    const invalidValues = safeParseResult.error.issues.map((issue) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      invalidValue: issue.path.reduce((obj: any, key) => obj?.[key], value),
      message: issue.message,
      path: issue.path.join('.'),
    }));

    console.error(
      '❌ Invalid environment variables detected:',
      JSON.stringify(invalidValues, null, 2),
    );

    throw new Error('Invalid environment variables');
  }

  return safeParseResult.data;
}

export default registerAs('config', () =>
  validateEnvWithZod({
    schema: z.intersection(
      z.union([
        z.object({
          IS_MODULE_TYPEORM_ENABLED: z.coerce.boolean().pipe(z.literal(false)),
          IS_MODULE_AUTH_ENABLED: z.coerce.boolean().pipe(z.literal(false)),
          IS_MODULE_CUSTOMER_ENABLED: z.coerce.boolean().pipe(z.literal(false)),
          IS_MODULE_CLAIM_ENABLED: z.coerce.boolean().pipe(z.literal(false)),
        }),
        z.object({
          IS_MODULE_TYPEORM_ENABLED: z.coerce.boolean().pipe(z.literal(true)),
          DATABASE_USER: z.string().nonempty('DATABASE_USER is required'),
          DATABASE_PASSWORD: z
            .string()
            .nonempty('DATABASE_PASSWORD is required'),
          DATABASE_NAME: z.string().nonempty('DATABASE_NAME is required'),
          DATABASE_HOST: z.string().nonempty('DATABASE_HOST is required'),
          DATABASE_PORT: z.coerce
            .number()
            .int()
            .min(1)
            .max(65535)
            .default(5432),
          DATABASE_TYPE: z.literal('postgres'),
          JWT_SECRET: z.string().nonempty('JWT_SECRET is required'),
          ADMIN_API_KEY: z.string().nonempty('ADMIN_API_KEY is required'),
          IS_MODULE_AUTH_ENABLED: z.coerce.boolean(),
          IS_MODULE_CUSTOMER_ENABLED: z.coerce.boolean(),
          IS_MODULE_CLAIM_ENABLED: z.coerce.boolean(),
        }),
      ]),
      z.union([
        z.object({
          IS_MODULE_ELASTIC_ENABLED: z.coerce.boolean().pipe(z.literal(false)),
          IS_MODULE_MICHELIN_ENABLED: z.coerce.boolean().pipe(z.literal(false)),
        }),
        z.object({
          IS_MODULE_ELASTIC_ENABLED: z.coerce.boolean().pipe(z.literal(true)),
          ELASTIC_HOST: z.string().nonempty('ELASTIC_URI is required'),
          ELASTIC_PORT: z.coerce.number().int().min(1).max(65535).default(9200),
          IS_MODULE_MICHELIN_ENABLED: z.coerce.boolean(),
        }),
      ]),
    ),
    value: process.env,
  }),
);
