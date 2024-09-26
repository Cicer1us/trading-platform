import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ENV } from '../config/env.validation';
import { Merchant, VerificationAction } from '@prisma/client';
import { LetterCompiler, LetterType } from './common/utils';
import { Interval } from 'src/common/interval';
import { PrismaService } from 'src/prisma/prisma.service';

const transport = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  auth: {
    user: ENV.SMTP_USERNAME,
    pass: ENV.SMTP_PASSWORD,
  },
});

const getVerificationUrl = (token: string) =>
  new URL(`merchant/verify-email/${token}`, ENV.CLIENT_HOST).toString();

const getResetPasswordUrl = (token: string) =>
  new URL(`merchant/reset-password/${token}`, ENV.CLIENT_HOST).toString();

@Injectable()
export class MailerService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(MailerService.name);

  async sendEmailVerificationLetter(merchant: Merchant) {
    const verification = await this.createVerification(
      merchant.id,
      VerificationAction.EMAIL_VERIFICATION,
    );
    const letterCompiler = LetterCompiler[LetterType.EmailVerification];
    const letter = letterCompiler({
      message: 'Email verification',
      verificationUrl: getVerificationUrl(verification.token),
    });
    this.sendMail(letter.subject, letter.html, letter.text, merchant);
  }

  async sendResetPasswordLetter(merchant: Merchant) {
    const verification = await this.createVerification(
      merchant.id,
      VerificationAction.RESET_PASSWORD,
    );
    const letterCompiler = LetterCompiler[LetterType.ResetPassword];
    const letter = letterCompiler({
      message: 'Reset password',
      verificationUrl: getResetPasswordUrl(verification.token),
    });
    this.sendMail(letter.subject, letter.html, letter.text, merchant);
  }

  async createVerification(
    merchantId: string,
    action: VerificationAction,
    interval = Interval.ONE_HOUR,
  ) {
    return this.prisma.verification.upsert({
      where: { merchantId },
      create: {
        merchantId,
        action,
        expiresAt: new Date(Date.now() + interval),
      },
      update: {
        action,
        expiresAt: new Date(Date.now() + interval),
      },
    });
  }

  sendMail(subject: string, html: string, text: string, merchant: Merchant) {
    transport
      .sendMail({
        from: ENV.SMTP_USERNAME,
        to: merchant.email,
        subject,
        text,
        html,
      })
      .then()
      .catch((error) =>
        this.logger.error(
          `Failed to send email to ${merchant.email}: ${error.message}}`,
        ),
      );
  }
}
