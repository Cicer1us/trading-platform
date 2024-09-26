import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  // General environment variables
  @IsEnum(Environment) NODE_ENV: Environment;
  @IsNumber() PORT: number;
  @IsString() DATABASE_URL: string;

  // Auth module
  @IsString() ACCESS_TOKEN_SECRET: string;
  @IsString() REFRESH_TOKEN_SECRET: string;

  // Payments module
  @IsString() CLIENT_HOST: string;

  // Mailer module
  @IsString() SMTP_HOST: string;
  @IsNumber() SMTP_PORT: number;
  @IsString() SMTP_USERNAME: string;
  @IsString() SMTP_PASSWORD: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export const ENV: EnvironmentVariables = validate(process.env);
