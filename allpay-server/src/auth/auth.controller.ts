import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Cookies } from 'src/common/cookies.decorator';
import { MerchantResponseDto } from 'src/merchants/dto/merchant-response.dto';
import { BadRequestResponseDto } from '../common/dto/bad-request-response.dto';
import { ConflictResponseDto } from '../common/dto/conflict-response.dto';
import { AuthService } from './auth.service';
import { REFRESH_TOKEN_COOKIE_KEY } from './common/constants';
import { Disable2Fa } from './common/disable-2fa.decorator';
import { AuthRequest } from './common/interfaces';
import { EmailDto } from './dto/email.dto';
import {
  AccessTokenResponse,
  LoginResponseDto,
} from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { GenerateOtpResponseDto, ValidateOtpDto } from './dto/otp.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenDto } from './dto/token.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@ApiTags('Auth')
@ApiBadRequestResponse({ type: BadRequestResponseDto })
@ApiConflictResponse({ type: ConflictResponseDto })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  @ApiCreatedResponse({ type: MerchantResponseDto })
  async registration(
    @Body() merchantCreateInput: RegisterDto,
  ): Promise<MerchantResponseDto> {
    return new MerchantResponseDto(
      await this.authService.register(merchantCreateInput),
    );
  }

  @Post('/resend-email-verification')
  @HttpCode(HttpStatus.NO_CONTENT)
  resendEmailVerification(@Body() data: EmailDto): Promise<void> {
    return this.authService.resendEmailVerification(data.email);
  }

  @Post('/login')
  @ApiCreatedResponse({ type: LoginResponseDto })
  login(
    @Body() loginInput: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginInput, res);
  }

  @Post('refresh')
  @ApiCreatedResponse({ type: AccessTokenResponse })
  async refresh(
    @Cookies(REFRESH_TOKEN_COOKIE_KEY) refreshToken?: string,
  ): Promise<AccessTokenResponse> {
    return this.authService.refreshAccess(refreshToken);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: MerchantResponseDto })
  me(@Request() req: AuthRequest): MerchantResponseDto {
    return new MerchantResponseDto(req.user);
  }

  @Post('/verify-email')
  @ApiCreatedResponse({ type: Boolean })
  verifyEmail(@Body() data: TokenDto): Promise<boolean> {
    return this.authService.verifyEmail(data.token);
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  forgotPassword(@Body() data: EmailDto): Promise<void> {
    return this.authService.forgotPassword(data.email);
  }

  @Post('/reset-password')
  @ApiCreatedResponse({ type: Boolean })
  resetPassword(@Body() data: ResetPasswordDto): Promise<boolean> {
    return this.authService.resetPassword(data.token, data.password);
  }

  @Get('/validate-verification/:token')
  @ApiOkResponse({ type: Boolean })
  validateVerificationToken(@Param('token') token: string): Promise<boolean> {
    return this.authService.validateVerificationToken(token);
  }

  @Post('/otp/generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GenerateOtpResponseDto })
  generateOtp(@Request() req: AuthRequest): Promise<GenerateOtpResponseDto> {
    return this.authService.generateOtp(req.user);
  }

  @Post('/otp/validate')
  @Disable2Fa(true)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: LoginResponseDto })
  validateOtp(
    @Request() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
    @Body() validateOtpDto: ValidateOtpDto,
  ): LoginResponseDto {
    return this.authService.validateOtp(req.user, validateOtpDto, res);
  }

  @Post('/otp/disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  disableOtp(@Request() req: AuthRequest): Promise<void> {
    return this.authService.disableOtp(req.user);
  }
}
