enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  UNRESOLVED = 'UNRESOLVED',
  RESOLVED = 'RESOLVED'
}

type OrderMetaData = {
  description: string;
  redirectUrl?: string;
  cancelUrl?: string;
  orderId: string;
  source: string;
};

export type Order = {
  id: string;
  merchantId: string;
  price: {
    fiatPrice: string;
    fiatCurrency: string;
  };
  metadata: OrderMetaData;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export type OrderPrice = {
  payInAmount: string;
  payInHumanAmount: string;
  estimatedGasCostUSD: number;
  priceRoute: any; // TODO: define type
  id: string;
  fiatPrice: number;
  fiatCurrency: string;
};

export type TxParams = {
  chainId: number;
  data: string;
  gas: string;
  gasPrice: string;
  to: string;
  value: string;
};
