import { Chains } from 'connection/chainConfig';

export const leverageAssets = ['BTC', 'ETH', 'LINK', 'SUSHI', 'AAVE', 'COMP', 'YFI', '1INCH', 'CRV', 'ZRX', 'MKR'];

export const getDydxApiHost = (chain: Chains) => {
  if (chain === Chains.GOERLI) {
    return 'https://api.stage.dydx.exchange';
  }
  return 'https://api.dydx.exchange';
};

export const getDydxWsHost = (chain: Chains) => {
  if (chain === Chains.GOERLI) {
    return 'wss://api.stage.dydx.exchange/v3/ws';
  }
  return 'wss://api.dydx.exchange/v3/ws';
};
