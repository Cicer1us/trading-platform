import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

class PriceDto {
  @ApiProperty()
  @IsString()
  fiatCurrency: string;

  @ApiProperty()
  @IsNumber()
  fiatPrice: number;
}

class MetadataDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  source: string;

  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cancelUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  redirectUrl: string;
}

export class CreatePaymentDto
  implements Omit<Prisma.PaymentUncheckedCreateInput, 'merchantId'>
{
  @ApiProperty()
  @ValidateNested()
  @Type(() => PriceDto)
  @IsNotEmpty()
  price: PriceDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => MetadataDto)
  @IsNotEmpty()
  metadata: MetadataDto;
}
