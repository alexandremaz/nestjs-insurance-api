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
    schema: z
      .object({
        DATABASE_USER: z.string().nonempty('DATABASE_USER is required'),
        DATABASE_PASSWORD: z.string().nonempty('DATABASE_PASSWORD is required'),
        DATABASE_NAME: z.string().nonempty('DATABASE_NAME is required'),
        DATABASE_HOST: z.string().nonempty('DATABASE_HOST is required'),
        DATABASE_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
        DATABASE_TYPE: z.literal('postgres'),
        JWT_SECRET: z.string().nonempty('JWT_SECRET is required'),
        ADMIN_API_KEY: z.string().nonempty('ADMIN_API_KEY is required'),
        ELASTIC_HOST: z.string().nonempty('ELASTIC_URI is required'),
        ELASTIC_PORT: z.coerce.number().int().min(1).max(65535).default(9200),
      })
      .transform(
        ({
          DATABASE_HOST,
          DATABASE_NAME,
          DATABASE_PASSWORD,
          DATABASE_PORT,
          DATABASE_TYPE,
          DATABASE_USER,
          ELASTIC_HOST,
          ELASTIC_PORT,
          ...rest
        }) => ({
          database: {
            DATABASE_HOST,
            DATABASE_NAME,
            DATABASE_PASSWORD,
            DATABASE_PORT,
            DATABASE_TYPE,
            DATABASE_USER,
          },
          elastic: {
            ELASTIC_HOST,
            ELASTIC_PORT,
          },
          ...rest,
        }),
      ),
    value: process.env,
  }),
);
