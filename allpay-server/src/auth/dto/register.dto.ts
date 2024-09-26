import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { Prisma } from '@prisma/client';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '../common/constants';

export class RegisterDto implements Prisma.MerchantCreateInput {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_MESSAGE })
  password: string;
}
