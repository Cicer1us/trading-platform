import { Request } from '@nestjs/common';
import { Merchant } from '@prisma/client';

export interface JwtPayload {
  email: string;
  requiresOtp?: boolean;
}

export type AuthRequest = Request & { user: Merchant };
