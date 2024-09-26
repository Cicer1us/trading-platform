import { Chains, chains } from 'connection/chainConfig';
import { CoinMarketContract } from '@/interfaces/Markets.interface';
import { TokenChain } from '@/interfaces/Tokens.interface';
import fetchMarketsMetadata from 'API/markets/getMarketsMetadata';

export const getAvailableMarketChains = async (marketIds: number[]): Promise<Record<number, Chains[]>> => {
  const metadataResponse = await fetchMarketsMetadata({ id: marketIds.join(',') });
  const metadata = metadataResponse?.data ?? {};
  const marketChains = {};
  const availableChains = Object.values(chains);

  for (const market of Object.values(metadata)) {
    const chains = [];

    const native = availableChains.find(c => c.nativeToken.symbol === market.symbol);
    if (native) chains.push(native.chainId);

    const addresses = filterAvailableMarketChains(market.contract_address).filter(
      chain => chain?.chainId !== native?.chainId
    );
    marketChains[market.id] = [...chains, ...addresses.map(add => add.chainId)];
  }

  return marketChains;
};

export const filterAvailableMarketChains = (addresses: CoinMarketContract[]): TokenChain[] => {
  const tokens: Record<string, TokenChain> = {};

  for (const chain of Object.values(chains)) {
    for (const platform of addresses) {
      if (platform.platform.coin.id === chain.coinMarketId && platform.platform.name === chain.coinMarketName) {
        tokens[chain.chainId] = { address: platform.contract_address, chainId: chain.chainId };
      }
    }
  }

  return Object.values(tokens);
};
