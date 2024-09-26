import { PARASWAP_URL } from '../constants';

export interface SwapSettings {
  partnerAddress?: string;
  feePercentage?: string;
}

export async function getSwapSettings(): Promise<SwapSettings> {
  const url = `${PARASWAP_URL}/swap/settings`;
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  return {};
}
