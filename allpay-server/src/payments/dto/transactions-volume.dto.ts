import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class TransactionsVolumeDto {
  @ApiProperty({ example: '2023-07-06T15:22:45.487Z', required: false })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiProperty({ example: '2023-07-06T15:22:45.487Z' })
  @IsDateString()
  toDate: string;
}

export class TransactionsVolumeResponseDto {
  @ApiProperty()
  volume: number;
}
