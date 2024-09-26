import { Provider } from '@web3-react/types';

interface Wallet extends Provider {
  isMetaMask: boolean;
  isCoinbaseWallet: boolean;
  isBraveWallet: boolean;
}

export interface EthereumWindow extends Window {
  customAttribute: any;
  ethereum: Wallet;
}
