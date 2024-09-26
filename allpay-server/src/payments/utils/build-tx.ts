import axios from 'axios';
import { ethers } from 'ethers';
import {
  Chain,
  DEFAULT_PAY_OUT_TOKEN,
  PAYMENT_GATEWAY_ADDRESS,
  RPC_URL,
  ZERO_ADDRESS,
} from '../../common/constants';
import {
  constructSimpleSDK,
  OptimalRate,
  TransactionParams,
} from '@paraswap/sdk';
import { PaymentGateway__factory } from 'contracts';
import { LibSwap } from 'contracts/PaymentGateway';
import { PaymentPrice } from 'src/payments/payments.interface';

export async function buildCompletePaymentTx(
  initiator: string,
  merchant: string,
  price: PaymentPrice,
): Promise<TransactionParams> {
  const { chainId, priceRoute, payInAmount, paymentId } = price;
  const payInToken =
    priceRoute?.srcToken ?? DEFAULT_PAY_OUT_TOKEN[chainId].address;
  const payOutToken =
    priceRoute?.destToken ?? DEFAULT_PAY_OUT_TOKEN[chainId].address;

  const provider = new ethers.providers.JsonRpcProvider(
    RPC_URL[chainId],
  ).getSigner(initiator);
  const PaymentGateway = PaymentGateway__factory.connect(
    PAYMENT_GATEWAY_ADDRESS[chainId],
    provider,
  );

  const [swapArgs, value] = await createSwapArgs(
    chainId,
    PaymentGateway.address,
    payInAmount,
    priceRoute,
  );

  const completePaymentData = PaymentGateway.interface.encodeFunctionData(
    'completePayment',
    [paymentId, payInToken, payOutToken, payInAmount, merchant, swapArgs],
  );

  const gasPrice = await provider.getGasPrice();
  const estimatedGasLimit = await provider.estimateGas({
    from: initiator,
    data: completePaymentData,
    to: PAYMENT_GATEWAY_ADDRESS[chainId],
    chainId,
    value,
  });

  return {
    gasPrice: gasPrice.toHexString(),
    gas: estimatedGasLimit.toHexString(),
    from: initiator,
    data: completePaymentData,
    to: PAYMENT_GATEWAY_ADDRESS[chainId],
    chainId,
    value,
  };
}

export async function createSwapArgs(
  chainId: Chain,
  initiator: string,
  payInAmount: string,
  priceRoute: OptimalRate | null,
): Promise<[LibSwap.SwapArgsStruct, string]> {
  const payOutToken = DEFAULT_PAY_OUT_TOKEN[chainId].address;
  const { swap } = constructSimpleSDK({ chainId, axios });

  // If the payInToken is the same as the payOutToken, we don't need to swap
  if (!priceRoute || priceRoute.srcToken === payOutToken) {
    return [
      {
        provider: ZERO_ADDRESS,
        approveProxy: ZERO_ADDRESS,
        callData: '0x',
      },
      '0',
    ];
  }

  const swapProviderContracts = await swap.getContracts();
  const swapTx = await swap.buildTx(
    {
      userAddress: initiator,
      srcToken: priceRoute.srcToken,
      destToken: priceRoute.destToken,
      srcDecimals: priceRoute.srcDecimals,
      destDecimals: priceRoute.destDecimals,
      srcAmount: payInAmount,
      destAmount: priceRoute.destAmount,
      priceRoute,
    },
    {
      ignoreChecks: true,
    },
  );

  return [
    {
      provider: swapProviderContracts.AugustusSwapper,
      approveProxy: swapProviderContracts.TokenTransferProxy,
      callData: swapTx.data,
    },
    swapTx.value,
  ];
}
