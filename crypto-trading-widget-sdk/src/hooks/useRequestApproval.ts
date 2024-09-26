import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { bitoftradeUtils } from '../utils/bitoftradeUtils';
import { Token } from '../data/tokens/token.interface';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { UseMutationOptions } from '@tanstack/react-query/src/types';

interface AssetApprovalProps {
  library: Web3Provider;
  spenderAddress: string;
  spenderToken: Token;
  amount?: string;
}

export const useRequestApproval = (options?: UseMutationOptions<TransactionResponse, Error, AssetApprovalProps>) => {
  const unlockAsset = ({
    library,
    spenderAddress,
    spenderToken,
    amount,
  }: AssetApprovalProps): Promise<TransactionResponse> => {
    // undefined means unlimited; requestApprove gives maximum allowance if no amount is provided
    const amountToUnlock = amount ? BigNumber(amount).toString() : undefined;

    return bitoftradeUtils.requestApprove(library, {
      clientAddress: spenderAddress,
      tokenAddress: spenderToken.address,
      decimals: spenderToken.decimals,
      chainId: library.network.chainId,
      amount: amountToUnlock,
    });
  };

  return useMutation(['approval'], unlockAsset, options);
};
