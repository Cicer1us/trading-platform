import {
  IsNumber,
  IsEnum,
  IsEthereumAddress,
  Max,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Chain, DEFAULT_SLIPPAGE } from 'src/common/constants';
import { Type } from 'class-transformer';
import { OptimalRate } from '@paraswap/sdk';
import { PaymentPrice } from '../payments.interface';

export class PaymentPriceQueryDto {
  @ApiProperty()
  @IsEthereumAddress()
  token: string;

  @ApiProperty()
  @IsEnum(Chain)
  @Type(() => Number)
  chainId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  decimals: number;

  // Slippage is in base points from 0 to 10000
  // 10000 = 100%
  // 100 = 1%
  @ApiProperty({ required: false, default: DEFAULT_SLIPPAGE })
  @IsOptional()
  @Max(10000)
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  slippage: number = DEFAULT_SLIPPAGE;
}

export class PaymentPriceDto implements PaymentPrice {
  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  fiatPrice: number;

  @ApiProperty()
  fiatCurrency: string;

  @ApiProperty()
  chainId: Chain;

  @ApiProperty()
  payInAmount: string;

  @ApiProperty()
  payInHumanAmount: string;

  @ApiProperty()
  estimatedGasCostUSD: number;

  @ApiProperty()
  priceRoute: OptimalRate | null;
}
