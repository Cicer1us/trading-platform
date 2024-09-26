import { Chains } from 'connection/chainConfig';
import { ConnectionType } from 'connection/connectors';

export enum ThemeColorEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface AppState {
  selectedWallet?: ConnectionType;
  theme: ThemeColorEnum;
  clientAddress: string;
  balances: Record<number, Record<string, number>>;
  language: string;
  chainId: Chains;
}
