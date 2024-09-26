import { Chain, CoinGeckoTokenPrices } from './types';

const BOF_SERVER = 'https://bof-v2-server-prod-docker.azurewebsites.net/';
const currency = 'usd';

async function fetchTokensUsdPrices(
  chainId: Chain,
  addresses: string[]
): Promise<Record<string, number>> {
  try {
    const query = new URLSearchParams({
      chainId: chainId.toString(),
      addresses: addresses.join(','),
    }).toString();

    const response = await fetch(`${BOF_SERVER}prices?${query}`);
    if (response.ok) {
      const prices = {};
      const json: CoinGeckoTokenPrices = await response.json();
      for (const address of addresses) {
        prices[address.toLowerCase()] = json[address]?.[currency] ?? 0;
      }
      return prices;
    }
  } catch (error) {
    console.error(error.message);
    return {};
  }
}

export async function getTokensUsdPrices(
  chainId: Chain,
  addresses: string[]
): Promise<Record<string, number>> {
  let balances = {};

  // maximum url length can contain only 40 tokens addresses
  const chunkSize = 40;
  for (let i = 0; i < addresses.length; i += chunkSize) {
    const chunk = addresses.slice(i, i + chunkSize).map((add) => add.toLowerCase());
    const chunkBalances = await fetchTokensUsdPrices(chainId, chunk);
    balances = { ...balances, ...chunkBalances };
  }

  return balances;
}
