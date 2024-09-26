import { SetMetadata } from '@nestjs/common';

export const DISABLE_2FA_DECORATOR_KEY = 'disable2fa';
export const Disable2Fa = (arg: boolean) =>
  SetMetadata(DISABLE_2FA_DECORATOR_KEY, arg);
