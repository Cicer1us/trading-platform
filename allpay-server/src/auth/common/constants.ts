export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const PASSWORD_REGEX_MESSAGE =
  'Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one symbol';

// Otp constants
export const OTP_SECRET_LENGTH = 12;
// Lifetime in seconds
export const OTP_LIFETIME = 30;
// How many expired otp codes considered valid
export const OTP_WINDOW = 1;
export const OTP_TOKEN_LENGTH = 6;

// Auth constants
export const ACCESS_TOKEN_LIFETIME = '15m';
export const NO_2FA_ACCESS_TOKEN_LIFETIME = '1h';

export const REFRESH_TOKEN_LIFETIME = '7d';
export const REFRESH_TOKEN_COOKIE_KEY = 'bitofrade-refresh';
