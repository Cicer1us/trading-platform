import { Chain, CrossRoute } from "./constants";
import CrossChainRouterAbi from "./abi/CrossChainRouter.json";
import CrossChainWalletAbi from "./abi/CrossChainWallet.json";

export type Address = string;
export type NumberAsString = string;

//transactions
export type TransactionParams = {
  to: Address;
  from: Address;
  value: NumberAsString;
  data: string;
  gasPrice: NumberAsString;
  gas?: NumberAsString;
  chainId: number;
};

//network configs
export interface ChainData {
  id: Chain;
  nativeToken: Token;
  usdcToken: Token;
  blockConfirmation: number;
  smartContracts: SmartContractsAddresses;
  abis: SmartContractAbis;
}

export interface Token {
  chainId: number;
  symbol: string;
  name: string;
  decimals: number;
  address: string;
}

export interface SmartContractsAddresses {
  crossChainRouter: string;
  crossChainWallet: string;
  paraswapSwapProvider: string;
  paraswapApproveProxyAddress: string;
  multichainRouterProvider: string;
  stargateRouter: string;
}

export interface SmartContractAbis {
  crossChainRouter: typeof CrossChainRouterAbi;
  crossChainWallet: typeof CrossChainWalletAbi;
}

export interface ConnectorTokens {
  [tokenAddress: string]: Token;
}

// get price
export enum SwapStatus {
  SUCCESS = "success",
  FAIL = "fail",
  SMART_WALLET_USDC_LOW_BALANCE = "smartWalletNotEnoughUSDC",
}

export type CrossChainPriceParams = {
  status: SwapStatus.SUCCESS | SwapStatus.SMART_WALLET_USDC_LOW_BALANCE;
  srcTxGasCost: string;
  connectorTokenAmountOnSrcNetwork: string;
  route: CrossRoute;
  destTxGasCost: string;
  destTokenAmount: string;
  minDestAmount: string;
  minConnectorTokenRefundAmount: string;
};

export type CrossChainPriceError = {
  status: SwapStatus.FAIL;
  message: string;
};
