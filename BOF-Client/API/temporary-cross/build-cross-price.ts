import { TransactionParams } from '@bitoftrade/cross-chain-core';
import { CrossPrice } from './get-cross-price';

interface QueryParams {
  data: CrossPrice;
  user: string;
}

export interface TransactionResponse {
  transaction: TransactionParams;
}

export interface CrossPriceError {
  error: string;
}

export async function tempBuildCrossSwap(
  queryParams: QueryParams,
  baseUrl: string
): Promise<TransactionResponse | CrossPriceError> {
  const url = new URL(baseUrl);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        userAddress: queryParams.user,
        refundAddress: queryParams.user,
        crossSwapPrice: queryParams.data,
      }),
    });
    const data = await response.json();
    return { transaction: data };
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return {
        error: error?.message ?? 'Unknown error',
      };
    }
  }
}
