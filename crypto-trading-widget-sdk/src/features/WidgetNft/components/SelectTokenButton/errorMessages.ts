import { SelectTokenButtonError } from './styled';

export const insufficientAllowanceWarning: SelectTokenButtonError = {
  displayLockIcon: true,
  severity: 'warning',
  message: 'Pay attention, your token is locked.',
};

export const insufficientBalanceError: SelectTokenButtonError = {
  severity: 'error',
  message: 'Insufficient balance',
};
