import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumberString } from 'class-validator';

export class GenerateOtpResponseDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  secret: string;
}

export class ValidateOtpDto {
  @ApiProperty()
  @IsNumberString()
  token: string;

  @ApiProperty()
  @IsBoolean()
  rememberMe: boolean;
}
