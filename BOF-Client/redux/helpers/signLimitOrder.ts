import { signLimitObj } from '@/common/web3/Web3Manager';
import { convertToWei } from '@/helpers/convertFromToWei';
import { LimitObjToSign } from '@/interfaces/LimitObjToSign.interface';
import { SignedLimitOrder } from '@/interfaces/LimitOrder.interface';
import { BigNumber } from '@0x/utils';
import store from './../store';
import { SupportedProvider } from '@0x/subproviders';

export async function signLimitOrderObj(
  sellAmount: number,
  buyAmount: number,
  period: number,
  provider: SupportedProvider,
  chainId: number
): Promise<SignedLimitOrder> {
  const state = store.getState();
  const tokenA = state.widget.selectedTokenA;
  const tokenB = state.widget.selectedTokenB;
  const clientAddress = state.app.clientAddress;
  const partner = state.limit.settings.partnerAddress;
  const feePercentage = state.limit.settings.feePercentage;
  const sellAmountInWei = convertToWei(sellAmount, tokenA.decimals);
  const buyAmountInWei = convertToWei(buyAmount, tokenB.decimals);
  const secondsInDay = 60 * 60 * 24;
  const expiry = Math.floor(Date.now() / 1000 + secondsInDay * period);
  const takerTokenFeeAmount = new BigNumber(
    Math.floor((Number(buyAmountInWei) * Number(feePercentage)) / 100)
  ).toString();

  const objToSign: LimitObjToSign = {
    expiry,
    maker: clientAddress,
    makerToken: tokenA.address,
    takerToken: tokenB.address,
    makerAmount: sellAmountInWei,
    takerAmount: buyAmountInWei,
    feeRecipient: partner,
    takerTokenFeeAmount,
  };
  const response = await signLimitObj(objToSign, provider, chainId);
  return response;
}
