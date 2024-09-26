import { TransactionParams, SwapSide, constructSimpleSDK, ContractMethod } from '@paraswap/sdk';
import axios from 'axios';
import { expect } from 'chai';
import { BigNumber, Wallet } from 'ethers';
import { ethers } from 'hardhat';

export type SrcCrossSwapEvent = {
  chainId: number;
  txHash: string;
  srcToken: string;
  srcAmount: string;
  destChainId: number;
  destToken: string;
  minDestAmount: string;
  destUser: string;
  connectorToken: string;
  connectorTokenIncome: string;
  refundAddress: string;
  liquidityProvider: string;
};

export type ParaswapInput = {
  chainId: number;
  userAddress: string;
  srcToken: string;
  destToken: string;
  amount: string;
  receiver?: string;
  side?: SwapSide;
};

export async function generateCalldataForSwap({
  chainId,
  userAddress,
  srcToken,
  destToken,
  amount,
  receiver,
  side = SwapSide.SELL,
}: ParaswapInput): Promise<TransactionParams> {
  const paraSwap = constructSimpleSDK({ network: chainId, axios });
  const priceRoute = await paraSwap.getRate({
    srcToken,
    destToken,
    amount: amount,
    userAddress,
    side,
    options: {
      excludeContractMethods: [
        //these methods don't support swap&transfer so we need to exclude them
        ContractMethod.swapOnUniswap,
        ContractMethod.buyOnUniswap,
        ContractMethod.swapOnUniswapFork,
        ContractMethod.buyOnUniswapFork,
        ContractMethod.swapOnUniswapV2Fork,
        ContractMethod.buyOnUniswapV2Fork,
        ContractMethod.swapOnZeroXv2,
        ContractMethod.swapOnZeroXv4,
      ],
    },
  });

  const swapAmount = {
    srcAmount: side === SwapSide.SELL ? amount : priceRoute?.srcAmount,
    destAmount: side === SwapSide.SELL ? BigNumber.from(priceRoute.destAmount).div(100).mul(99).toString() : amount,
  };

  const txParams = await paraSwap.buildTx(
    {
      srcToken,
      destToken,
      priceRoute,
      userAddress,
      receiver,
      ...swapAmount,
    },
    { ignoreChecks: true }
  );

  const transaction = {
    ...txParams,
    value: BigNumber.from(txParams.value).toHexString(),
    gasPrice: BigNumber.from(txParams.gasPrice).toHexString(),
  };

  return transaction;
}

type CreateSignatureInput = {
  eventName: string;
  crossChainRouter: string;
  event: SrcCrossSwapEvent;
  wallet: Wallet;
};

export function createSrcSwapSignature({ eventName, crossChainRouter, event, wallet }: CreateSignatureInput): string {
  const {
    chainId,
    txHash,
    srcAmount,
    srcToken,
    destChainId,
    destToken,
    destUser,
    minDestAmount,
    connectorToken,
    connectorTokenIncome,
    refundAddress,
    liquidityProvider,
  } = event;

  const messageHash = ethers.utils.solidityKeccak256(
    [
      'string',
      'uint256',
      'address',
      'bytes32',
      'address',
      'uint256',
      'uint256',
      'address',
      'uint256',
      'address',
      'address',
      'uint256',
      'address',
      'string',
    ],
    [
      eventName,
      chainId,
      crossChainRouter,
      txHash,
      srcToken,
      srcAmount,
      destChainId,
      destToken,
      minDestAmount,
      destUser,
      connectorToken,
      connectorTokenIncome,
      refundAddress,
      liquidityProvider,
    ]
  );

  const { r, s, v } = wallet._signingKey().signDigest(messageHash);
  return r + s.slice(2) + ethers.utils.hexlify(v).slice(2);
}

// ethers returned parsed event args as Object and Array at the same time
// it creates problems when we try to compare them with expected values
// so, to make it consistent, we need to filter out array params
export function parseLogArgs(obj: Record<string, any>) {
  return filterObjectParams(obj);
}

function filterObjectParams(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (isNaN(Number(key))) {
      if (Array.isArray(obj[key]) && obj[key].every((item: any) => typeof item === 'object')) {
        result[key] = obj[key].map((item: any) => filterObjectParams(item));
      } else {
        result[key] = obj[key];
      }
    }
  });
  return result;
}

// ethers cannot handle revert reason with the appostrophe
// use this function to overcome this issue
export async function expectRevertWithReason(transactionCall: Promise<any>, expectedRevertedReason: string) {
  try {
    await expect(transactionCall).to.be.revertedWith(expectedRevertedReason);
  } catch (e: any) {
    const message = e.message;
    const revertedReason = message.split('reverted with reason string ')[1].replace(/^'(.*)'$/, '$1');
    expect(revertedReason).to.be.equal(expectedRevertedReason);
  }
}
