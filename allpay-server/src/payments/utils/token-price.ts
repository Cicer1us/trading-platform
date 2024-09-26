import axios from 'axios';
import { utils, BigNumber, ethers } from 'ethers';
import { OptimalRate, constructSimpleSDK, SwapSide } from '@paraswap/sdk';
import { PaymentTokenPrice } from 'src/payments/payments.interface';
import {
  DEFAULT_PAY_OUT_TOKEN,
  TRANSFER_CASE_BASE_GAS_LIMIT,
  SWAP_CASE_BASE_GAS_LIMIT,
  Chain,
  RPC_URL,
  Token,
} from 'src/common/constants';

export async function calculatePaymentTokenPrice(
  priceUSD: number,
  payInToken: Pick<Token, 'address' | 'chainId' | 'decimals'>,
  slippage: number,
): Promise<Omit<PaymentTokenPrice, 'chainId'>> {
  const payOutToken = DEFAULT_PAY_OUT_TOKEN[payInToken.chainId];
  const expectedPayOutAmount = convertFromHuman(priceUSD, payOutToken.decimals);

  const { swap } = constructSimpleSDK({ chainId: payInToken.chainId, axios });
  const rate = await swap.getRate({
    srcToken: payInToken.address,
    srcDecimals: payInToken.decimals,
    destDecimals: payOutToken.decimals,
    destToken: payOutToken.address,
    amount: expectedPayOutAmount,
    side: SwapSide.BUY,
  });

  return formPaymentTokenPrice(
    payInToken,
    payOutToken,
    expectedPayOutAmount,
    rate,
    slippage,
  );
}

function formPaymentTokenPrice(
  payInToken: Pick<Token, 'address' | 'chainId' | 'decimals'>,
  payOutToken: Token,
  payOutAmount: string,
  rate: OptimalRate,
  slippage: number,
): Omit<PaymentTokenPrice, 'chainId'> {
  const type = payInToken.address === payOutToken.address ? 'transfer' : 'swap';

  const totalGasLimit =
    type === 'transfer'
      ? TRANSFER_CASE_BASE_GAS_LIMIT[payOutToken.chainId]
      : SWAP_CASE_BASE_GAS_LIMIT[payOutToken.chainId] + Number(rate.gasCost);

  const totalGasLimitUSD = calculateTotalGasLimitUSD(
    rate.gasCost,
    rate.gasCostUSD,
    totalGasLimit,
  );

  const payInAmount =
    type === 'transfer'
      ? payOutAmount
      : applySlippage(rate.srcAmount, slippage);

  const payInHumanAmount = convertToHuman(payInAmount, payInToken.decimals);

  return {
    payInAmount,
    payInHumanAmount,
    estimatedGasCostUSD: totalGasLimitUSD,
    priceRoute: type === 'transfer' ? null : rate,
  };
}

export function convertToHuman(amount: string, decimals: number): string {
  return ethers.utils.formatUnits(amount, decimals);
}

export function convertFromHuman(amount: number, decimals: number): string {
  return utils.parseUnits(amount.toFixed(decimals), decimals).toString();
}

export function getCurrentBlock(chainId: Chain): Promise<number> {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL[chainId]);
  return provider.getBlockNumber();
}

// add slippage to the amount, because in the current implementation, swap side is BUY only
export function applySlippage(amount: string, slippage: number): string {
  return BigNumber.from(amount)
    .mul(10000 + slippage)
    .div(10000)
    .toString();
}

export function calculateTotalGasLimitUSD(
  baseGasLimit: string,
  baseGasLimitUSD: string,
  totalGasLimit: number,
): number {
  // to calculate total USD gas amount, use this proportion:
  // baseGasLimit --- baseGasLimitUSD
  // totalGasLimit --- totalGasLimitUSD?
  // therefore, totalGasLimitUSD = totalGasLimit * baseGasLimitUSD / baseGasLimit
  return (totalGasLimit * Number(baseGasLimitUSD)) / Number(baseGasLimit);
}
