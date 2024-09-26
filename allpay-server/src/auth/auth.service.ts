import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  Merchant,
  Prisma,
  Verification,
  VerificationAction,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ENV } from 'src/config/env.validation';
import { MailerService } from 'src/mailer/mailer.service';
import { MerchantsService } from 'src/merchants/merchants.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ACCESS_TOKEN_LIFETIME,
  NO_2FA_ACCESS_TOKEN_LIFETIME,
  OTP_LIFETIME,
  OTP_SECRET_LENGTH,
  OTP_WINDOW,
  REFRESH_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_LIFETIME,
} from './common/constants';
import { JwtPayload } from './common/interfaces';
import { constructTOTP, generateRandomBase32 } from './common/utils';
import {
  AccessTokenResponse,
  LoginResponseDto,
} from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { GenerateOtpResponseDto, ValidateOtpDto } from './dto/otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private merchantsService: MerchantsService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  async validateMerchant(email: string, pass: string): Promise<Merchant> {
    const merchant = await this.merchantsService.findBy({ email });

    if (!merchant) {
      throw new UnauthorizedException("User with this email doesn't exist");
    }

    if (!merchant.emailIsVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    if (!bcrypt.compareSync(pass, merchant.password)) {
      throw new UnauthorizedException(
        'Incorrect login and password combination',
      );
    }

    return merchant;
  }

  signAccessToken(merchant: Merchant, requiresOtp: boolean): string {
    const payload: JwtPayload = {
      email: merchant.email,
      requiresOtp,
    };

    return this.jwtService.sign(payload, {
      secret: ENV.ACCESS_TOKEN_SECRET,
      expiresIn: requiresOtp
        ? ACCESS_TOKEN_LIFETIME
        : NO_2FA_ACCESS_TOKEN_LIFETIME,
    });
  }

  signRefreshToken(merchant: Merchant): string {
    const payload: JwtPayload = {
      email: merchant.email,
    };

    return this.jwtService.sign(payload, {
      secret: ENV.REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_LIFETIME,
    });
  }

  attachRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
      httpOnly: true,
      sameSite: true,
    });
  }

  async login(loginDto: LoginDto, res: Response): Promise<LoginResponseDto> {
    const merchant = await this.validateMerchant(
      loginDto.email,
      loginDto.password,
    );

    const accessToken = this.signAccessToken(
      merchant,
      !!merchant.otpBase32Secret,
    );

    if (!merchant.otpBase32Secret) {
      const refreshToken = this.signRefreshToken(merchant);
      this.attachRefreshTokenCookie(res, refreshToken);
    }

    return {
      accessToken,
      requiresOtp: !!merchant.otpBase32Secret,
    };
  }

  verifyJwt(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: ENV.REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async refreshAccess(refreshToken?: string): Promise<AccessTokenResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const decodedJwt = this.verifyJwt(refreshToken);
    const merchant = await this.merchantsService.findBy({
      email: decodedJwt.email,
    });
    const accessToken = this.signAccessToken(merchant as Merchant, false);
    return { accessToken };
  }

  async register(
    merchantCreateInput: Prisma.MerchantCreateInput,
  ): Promise<Merchant> {
    const merchant = await this.merchantsService.create(merchantCreateInput);
    if (merchant) {
      this.mailerService.sendEmailVerificationLetter(merchant).then();
    }
    return merchant;
  }

  async resendEmailVerification(email: string): Promise<void> {
    const merchant = await this.prisma.merchant.findFirstOrThrow({
      where: { email },
    });
    this.mailerService.sendEmailVerificationLetter(merchant).then();
  }

  async verifyEmail(token: string): Promise<boolean> {
    const verification = await this.findVerificationOrThrow(
      token,
      VerificationAction.EMAIL_VERIFICATION,
    );
    await this.prisma.merchant.update({
      data: { emailIsVerified: true },
      where: { id: verification.merchantId },
    });

    this.prisma.verification.delete({ where: { id: verification.id } }).then();
    return true;
  }

  async forgotPassword(email: string): Promise<void> {
    const merchant = await this.prisma.merchant.findUniqueOrThrow({
      where: { email },
    });
    this.mailerService.sendResetPasswordLetter(merchant).then();
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const verification = await this.findVerificationOrThrow(
      token,
      VerificationAction.RESET_PASSWORD,
    );
    const hashedPassword = this.merchantsService.hashPassword(newPassword);
    await this.prisma.merchant.update({
      where: { id: verification.merchantId },
      data: { password: hashedPassword },
    });
    return true;
  }

  async validateVerificationToken(token: string): Promise<boolean> {
    const verification = await this.prisma.verification.findUnique({
      where: {
        token,
      },
    });
    return !!verification;
  }

  findVerificationOrThrow(
    token: string,
    action: VerificationAction,
  ): Promise<Verification> {
    return this.prisma.verification.findFirstOrThrow({
      where: {
        token,
        action,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async generateOtp(merchant: Merchant): Promise<GenerateOtpResponseDto> {
    const otpSecret = generateRandomBase32(OTP_SECRET_LENGTH);
    const totp = constructTOTP(merchant.email, otpSecret);

    const otpUrl = totp.toString();

    await this.prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        otpBase32Secret: otpSecret,
      },
    });

    return {
      url: otpUrl,
      secret: otpSecret,
    };
  }

  validateOtp(
    merchant: Merchant,
    validateOtpDto: ValidateOtpDto,
    res: Response,
  ): LoginResponseDto {
    if (!merchant.otpBase32Secret) {
      throw new BadRequestException('Otp is not generated');
    }
    const totp = constructTOTP(merchant.email, merchant.otpBase32Secret);
    const validationRes = totp.validate({
      token: validateOtpDto.token,
      timestamp: Date.now() + OTP_LIFETIME * 1000,
      window: OTP_WINDOW,
    });

    const accessToken = this.signAccessToken(merchant, false);
    const refreshToken = this.signRefreshToken(merchant);
    this.attachRefreshTokenCookie(res, refreshToken);

    if (validationRes) {
      return { accessToken };
    }
    throw new NotAcceptableException('Wrong otp token');
  }

  async disableOtp(merchant: Merchant): Promise<void> {
    await this.prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        otpBase32Secret: '',
      },
    });
    return;
  }
}
