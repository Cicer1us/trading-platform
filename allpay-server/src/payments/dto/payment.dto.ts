import { ApiProperty } from '@nestjs/swagger';
import {
  OrderMetadata,
  OrderPrice,
  Payment,
  PaymentStatus,
  Transaction,
} from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

class PaymentUrlDto {
  @ApiProperty()
  paymentUrl: string;
}

export class PaymentCreatedResponseDto {
  @ApiProperty({ type: PaymentUrlDto })
  data: PaymentUrlDto;
}

class OrderPriceDto implements OrderPrice {
  @ApiProperty()
  fiatPrice: number;

  @ApiProperty()
  fiatCurrency: string;
}

class OrderMetadataDto implements OrderMetadata {
  @ApiProperty()
  description: string;

  @ApiProperty({ required: false })
  redirectUrl: string;

  @ApiProperty({ required: false })
  cancelUrl: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  source: string;
}

class PaymentTransactionDto implements Omit<Transaction, 'id'> {
  @ApiProperty()
  @IsString()
  storeName: string;

  @ApiProperty()
  @IsString()
  paymentId: string;

  @ApiProperty()
  @IsNumber()
  chainId: number;

  @ApiProperty()
  @IsString()
  txHash: string;

  @ApiProperty()
  @IsString()
  merchant: string;

  @ApiProperty()
  @IsString()
  payInToken: string;

  @ApiProperty()
  @IsString()
  payOutToken: string;

  @ApiProperty()
  @IsString()
  payInAmount: string;

  @ApiProperty()
  @IsString()
  payOutAmount: string;

  @ApiProperty()
  @IsNumber()
  payOutHumanAmount: number;

  @ApiProperty()
  @IsString()
  initiator: string;

  @ApiProperty()
  @IsString()
  txGasUsed: string;

  @ApiProperty()
  @IsString()
  txGasPrice: string;

  @ApiProperty()
  @IsString()
  blockHash: string;

  @ApiProperty()
  @IsString()
  blockNumber: string;

  @ApiProperty()
  @IsString()
  timestamp: string;
}

export class PaymentResponseDto implements Payment {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ type: OrderPriceDto })
  price: OrderPriceDto;

  @ApiProperty({ type: OrderMetadataDto })
  metadata: OrderMetadataDto;

  @Exclude()
  merchantId: string;

  @Exclude()
  transaction: PaymentTransactionDto;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<Payment>) {
    Object.assign(this, partial);
  }
}
