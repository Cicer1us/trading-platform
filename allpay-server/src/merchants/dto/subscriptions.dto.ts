import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class SubscriptionsDto {
  @ApiProperty()
  @IsArray()
  subscriptionUrls: string[];
}
