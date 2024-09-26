import { chains, Chains } from 'connection/chainConfig';
import { CoinGeckoTokenPrices } from '@/interfaces/Coingecko.interface';
import { COIN_GECKO_URL } from 'constants/urls';

export default async function getTokensPrices(chainId: Chains, addresses: string[]): Promise<Record<string, number>> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    const currency = 'usd';
    const coinGeckoId = chains[chainId].coingeckoChain;
    const query = new URLSearchParams({
      vs_currencies: currency,
      contract_addresses: addresses.join(','),
      x_cg_pro_api_key: apiKey,
    }).toString();

    const response = await fetch(`${COIN_GECKO_URL}/v3/simple/token_price/${coinGeckoId}?${query}`);

    if (response.ok) {
      const prices = {};
      const json: CoinGeckoTokenPrices = await response.json();
      for (const address of addresses) {
        prices[address] = json[address]?.usd ?? 0;
      }
      return prices;
    }
  } catch (error) {
    console.error(error.message);
    return {};
  }
}
