import { Chains } from 'connection/chainConfig';
import { ParaswapSwap } from './Paraswap.interface';
import { TableTx } from './TransactionTable.interface';

export interface SwapTx extends TableTx<ParaswapSwap> {
  confirmed: boolean;
  protocolFee: string;
  gasFee: string;
}

export interface AddApprove {
  chainId: Chains;
  txHash: string;
  address: string;
}

export interface RemoveApprove {
  chainId: Chains;
  address: string;
}
