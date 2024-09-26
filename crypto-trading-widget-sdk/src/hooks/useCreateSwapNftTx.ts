import { SwappableNFTOrder } from '@paraswap/sdk';
import { Chain } from 'utils/chains';
import { TransactionRequest, TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { useMutation } from '@tanstack/react-query';
import { UseMutationOptions } from '@tanstack/react-query/src/types';
import BigNumber from 'bignumber.js';
import { Token } from 'data/tokens/token.interface';
import { constructNftTakerSdk } from 'services/paraswap/constructNftTakerSdk';

interface SwapNftParams {
  library: Web3Provider;
  order: SwappableNFTOrder;
  chain: Chain;
  account: string;
  srcToken: Token;
}

export const useCreateSwapNftTx = (
  queryKeyIdentifiers: { account?: string; orderHash?: string },
  options?: UseMutationOptions<TransactionResponse, Error, SwapNftParams>
) => {
  const createTx = async ({ library, chain, account, order, srcToken }: SwapNftParams) => {
    const takerSDK = constructNftTakerSdk(library, chain, account);

    const { gas: payloadGas, ...txParams } = await takerSDK.buildNFTOrderTx(
      {
        srcDecimals: srcToken.decimals,
        userAddress: account,
        // TODO: Add partner address
        orders: [order],
      },
      { ignoreChecks: true }
    );

    const transaction: TransactionRequest = {
      ...txParams,
      gasPrice: '0x' + new BigNumber(txParams.gasPrice).toString(16),
      value: '0x' + new BigNumber(txParams.value).toString(16),
    };
    if (payloadGas) transaction.gasLimit = '0x' + new BigNumber(payloadGas).toString(16);

    return library.getSigner(account).sendTransaction(transaction);
  };

  const { account, orderHash } = queryKeyIdentifiers;
  return useMutation(['createSwapNftTx', account, orderHash], createTx, options);
};
