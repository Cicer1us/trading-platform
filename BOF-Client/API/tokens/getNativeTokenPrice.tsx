import { chains, Chains } from 'connection/chainConfig';
import { COIN_GECKO_URL } from 'constants/urls';

export default async function getNativeTokenPrice(chainId: Chains): Promise<number> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    const currency = 'usd';
    const coinGeckoId = chains[chainId].nativeToken.coingeckoId;
    const response = await fetch(
      `${COIN_GECKO_URL}/v3/simple/price?vs_currencies=${currency}&ids=${coinGeckoId}&x_cg_pro_api_key=${apiKey}`
    );

    if (response.ok) {
      const json = await response.json();
      return json?.[coinGeckoId]?.[currency] ?? 0;
    }
  } catch (error) {
    console.error(error.message);
    return 0;
  }
}
