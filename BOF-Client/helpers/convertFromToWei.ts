import { BigNumber } from '@0x/utils';
import convertExpToString from './convertExpToString';

// TODO: replace for formatUnits and parseUnits from @ethersproject/units
export function convertToWei(amount: number, decimals: number): string {
  return new BigNumber(Math.ceil(amount * 10 ** decimals)).toString();
}

export function convertFromWei(amount: number, decimals: number): string {
  return convertExpToString(amount / 10 ** decimals);
}
