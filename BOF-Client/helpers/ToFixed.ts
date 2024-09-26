import { CheckDollarTokens } from 'helpers/CheckDollarTokens';

export const ToFixed = (value: string | number, tokenName: string, num?: number): string => {
  if (!value && value !== 0) return;
  const parts = value.toString().split('.');

  if (CheckDollarTokens(tokenName) && parts[1]) {
    parts[1] = parts[1].slice(0, 2);
    return parts.join('.');
  }

  if (num && parts[1]) {
    parts[1] = parts[1].slice(0, num);
    return parts.join('.');
  }

  return parts.join('.');
};
