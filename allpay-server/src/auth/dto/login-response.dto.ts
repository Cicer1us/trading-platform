import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  requiresOtp?: boolean;
}

export class AccessTokenResponse {
  @ApiProperty()
  accessToken: string;
}
