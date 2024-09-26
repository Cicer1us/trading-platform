import { Merchant } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class MerchantResponseDto implements Merchant {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  apiKey: string;
  @ApiProperty()
  subscriptionSecret: string;
  @ApiProperty()
  subscriptionUrls: string[];
  @ApiProperty()
  walletAddress: string;

  @Exclude()
  emailIsVerified: boolean;
  @Exclude()
  password: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  otpBase32Secret: string;
  @Exclude()
  requiresOtp: string;

  constructor(partial: Partial<Merchant>) {
    Object.assign(this, partial);
  }
}
