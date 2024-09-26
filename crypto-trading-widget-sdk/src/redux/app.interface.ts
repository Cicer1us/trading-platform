import { Token } from '../data/tokens/token.interface';
import { PriceRoute, SwapTxObj } from '@bitoftrade/bof-utils';
import { Chain } from '../utils/chains';
import { ConnectionType } from 'utils/connections';

export enum AssetDirection {
  Pay = 'Pay',
  Receive = 'receive',
}

export interface InputOptions {
  amount: string;
  locked: boolean;
  loading: boolean;
  maxButton?: boolean;
  startingDirection: AssetDirection;
}

export enum InputAction {
  PayValueChange,
  ReceiveValuedChange,
  SwitchInputs,
}

export enum WidgetScreen {
  Default,
  SearchPayToken,
  SearchReceiveToken,
  ConfirmTransaction,
  UnlockAsset,
  ConnectWallet,
}

export interface TokenList {
  tokens: Record<string, Token>;
  youPayToken: string;
  youReceiveToken: string;
  status?: 'loading' | 'done';
  timestamp: number;
}

export type TokenListMap = {
  [chain in Chain]: TokenList;
};

export interface AppState {
  currentScreen: WidgetScreen;
  youPay: InputOptions;
  youReceive: InputOptions;
  priceRoute: PriceRoute | null;
  transaction?: SwapTxObj;
  buttonError: string | null;
  tokenListMap: TokenListMap;
  chainList: Chain[];
  selectedChain: Chain;
  selectedWallet: ConnectionType | undefined;
  swapTxInProgress: boolean;
}
