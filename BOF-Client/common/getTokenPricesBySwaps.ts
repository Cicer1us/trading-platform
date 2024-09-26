import getNativeTokenPrice from 'API/tokens/getNativeTokenPrice';
import getTokensPrices from 'API/tokens/getTokensPrices';
import { Chains, chains } from '../connection/chainConfig';

export const getTokenPricesBySwaps = async (chainId: Chains, addresses: string[]): Promise<Record<string, number>> => {
  const nativeToken = chains[chainId].nativeToken;

  // max amount of tokens per request is 40
  const chunkSize = 40;
  const requests = [];
  for (let i = 0; i < addresses.length; i += chunkSize) {
    const chunk = addresses.slice(i, i + chunkSize);
    requests.push(getTokensPrices(chainId, chunk));
  }

  try {
    let prices = {};
    const [nativeTokenPrice, ...pricesResponse] = await Promise.all([getNativeTokenPrice(chainId), ...requests]);
    pricesResponse.forEach(priceResponse => (prices = { ...prices, ...priceResponse }));
    prices[nativeToken.address] = nativeTokenPrice;
    return prices;
  } catch (e) {
    console.error(e.message);
    return null;
  }
};
