import axios from 'axios';
import { ALLPAY_SERVER_BASE_URL } from 'src/common/constants';
import { ChainId, Token } from 'src/connection/types';
import { OrderPrice, TxParams } from 'src/hooks/types';

type PaymentTransaction = {
  initiator: string;
  merchant: string;
  payInAmount: string;
  payInToken: string;
  payOutAmount: string;
  payOutToken: string;
  blockHash: string;
  blockNumber: string;
  timestamp: string;
  txHash: string;
  txGasPrice: string;
  txGasUsed: string;
  chainId: ChainId;
};

type PaymentMetadata = {
  description: string;
  orderId: string;
  source: string;
};

type PaymentPrice = {
  fiatPrice: number;
  fiatCurrency: string;
};

export type Payment = {
  merchantId: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  price: PaymentPrice;
  metadata: PaymentMetadata;
  transaction?: PaymentTransaction;
};

export interface GetPaymentsParams {
  take?: number;
  skip?: number;
}

export interface GetPaymentsResponse {
  data: Payment[];
  total: number;
}

export const getPaymentPrice = async (orderId: string, token: Token, slippage: number) => {
  const { data } = await axios.get(`${ALLPAY_SERVER_BASE_URL}/payments/price/${orderId}`, {
    params: { token: token.address, chainId: token.chainId, decimals: token.decimals, slippage }
  });

  return data;
};

export const getOrderById = async (id: string) => {
  const { data } = await axios.get(`${ALLPAY_SERVER_BASE_URL}/payments/${id}`);

  return data;
};

export const getPayments = async (params: GetPaymentsParams): Promise<GetPaymentsResponse> => {
  const { data } = await axios.get(`${ALLPAY_SERVER_BASE_URL}/payments/`, { params });

  return data;
};

export const buildTx = async (orderPrice: OrderPrice, account: string): Promise<TxParams> => {
  const { data: txData } = await axios.post(`${ALLPAY_SERVER_BASE_URL}/payments/build-tx`, {
    price: orderPrice,
    initiator: account
  });

  return txData;
};
