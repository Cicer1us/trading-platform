import { randomBytes } from 'crypto';
import * as OTPAuth from 'otpauth';
import { OTP_LIFETIME, OTP_TOKEN_LENGTH } from './constants';

export function constructTOTP(email: string, base32Secret: string) {
  return new OTPAuth.TOTP({
    issuer: 'bitoftrade.com',
    label: email,
    algorithm: 'SHA1',
    digits: OTP_TOKEN_LENGTH,
    period: OTP_LIFETIME,
    secret: base32Secret,
  });
}

export function generateRandomBase32(length: number) {
  // Base32 character set
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';

  // Generate random binary data
  const binaryData = randomBytes(length);

  // Convert binary data to Base32 representation
  for (let i = 0; i < length; i++) {
    const index = binaryData[i] % charset.length;
    result += charset.charAt(index);
  }

  return result;
}
