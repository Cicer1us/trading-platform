import { AssetInputError } from '../components/AssetInput/AssetInput';

export enum InputError {
  InsufficientBalance = 'InsufficientBalance',
  InsufficientAllowance = 'InsufficientAllowance',
  TokensTheSame = 'TokensTheSame',
}

export const inputErrors: Record<InputError, AssetInputError> = {
  [InputError.InsufficientBalance]: {
    message: 'Insufficient balance',
    severity: 'error',
  },
  [InputError.InsufficientAllowance]: {
    message: 'Pay attention, your token is locked',
    severity: 'warning',
  },
  [InputError.TokensTheSame]: {
    message: 'Pay and receive tokens are the same',
    severity: 'warning',
  },
};
