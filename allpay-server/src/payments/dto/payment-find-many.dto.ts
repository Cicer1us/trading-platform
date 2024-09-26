import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEthereumAddress,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { toNumber } from 'src/common/cast.utils';

export class PaymentFindManyDto {
  @ApiProperty({ default: 10, required: false })
  @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
  @IsNumber()
  @IsOptional()
  take?: number;

  @ApiProperty({ default: 0, required: false })
  @Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
  @IsNumber()
  @IsOptional()
  skip?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  toDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsEthereumAddress()
  payInToken?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsEthereumAddress()
  payOutToken?: string;
}
