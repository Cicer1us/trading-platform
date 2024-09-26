import { AllowanceInput, PriceInput } from '@/interfaces/SwapPrice.interface';
import { BuildSrcCrossSwapResponse, constructSDK } from '@bitoftrade/cross-chain-frontend-sdk';
import { CrossChainPriceError, CrossChainPriceParams, SwapStatus } from '@bitoftrade/cross-chain-core';
import { chains } from '../connection/chainConfig';
import { ethers } from 'ethers';
import { availableChainsCrossSwap } from './constants';
import { CrossPrice, tempGetCrossSwapPrice } from 'API/temporary-cross/get-cross-price';
import { tempBuildCrossSwap } from 'API/temporary-cross/build-cross-price';

export interface CrossSwapPrice extends Omit<CrossChainPriceParams, 'srcTxGasCost' | 'destTxGasCost'> {
  data: CrossPrice;
  srcTxGasCostUSD: number;
  destTxGasCostUSD: number;
}

const providers: Record<number, any> = availableChainsCrossSwap.reduce(
  (acc, chainId) => ({
    ...acc,
    [chainId]: new ethers.providers.StaticJsonRpcProvider(chains[chainId].rpcUrl),
  }),
  {}
);

const mmUrl = 'https://bof-cross-chain-market-maker-dev.azurewebsites.net';
// const mmUrl = 'http://localhost:4444';

export const SDK = constructSDK(providers);

export const getCrossSwapPrice = async ({
  srcToken,
  destToken,
  amount,
  slippage,
}: PriceInput): Promise<CrossSwapPrice | CrossChainPriceError> => {
  const price = await tempGetCrossSwapPrice(
    {
      srcChainId: srcToken.chainId,
      srcToken: srcToken.address,
      srcTokenDecimals: srcToken.decimals,
      destChainId: destToken.chainId,
      destToken: destToken.address,
      destTokenDecimals: destToken.decimals,
      amount: amount,
      slippage: slippage,
    },
    `${mmUrl}/cross-swap-price`
  );
  // used for debugging
  console.log('cross swap price', price);
  if ('error' in price) {
    return {
      message: price.error,
      status: SwapStatus.FAIL,
    };
  }

  return {
    data: price,
    status: SwapStatus.SUCCESS,
    srcTxGasCostUSD: price.srcSwap.estimatedGas.gasLimitUSD,
    connectorTokenAmountOnSrcNetwork: price.minConnectorTokenRefundAmount,
    route: price.route,
    destTxGasCostUSD: price.destSwap.estimatedGas.gasLimitUSD,
    destTokenAmount: price.destSwap.destAmount,
    minDestAmount: price.destSwap.minDestAmount,
    minConnectorTokenRefundAmount: price.minConnectorTokenRefundAmount,
  };
};

export const getCrossSwapAllowance = async ({ token, clientAddress }: AllowanceInput): Promise<string> => {
  try {
    return SDK.getAllowance({
      token: token.address,
      chainId: token.chainId,
      userAddress: clientAddress,
    });
  } catch (e) {
    return '0';
  }
};

//it looks like something wrong with TS configuration in the project, as it should report that response type is incorrect
export const buildCrossSwapTx = async (params: {
  data: CrossPrice;
  user: string;
}): Promise<BuildSrcCrossSwapResponse> => {
  const response = await tempBuildCrossSwap(params, `${mmUrl}/build-cross-src-tx`);

  if ('error' in response) {
    throw new Error(response.error);
  }

  return { transaction: response.transaction, route: params.data.route };
};
