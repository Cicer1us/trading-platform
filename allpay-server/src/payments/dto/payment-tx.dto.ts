import { ApiProperty } from '@nestjs/swagger';

export class PaymentTxDto {
  @ApiProperty()
  to: string;

  @ApiProperty()
  from: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  gasPrice: string;

  @ApiProperty({ required: false })
  gas?: string;

  @ApiProperty()
  chainId: number;
}
