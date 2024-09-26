import { CacheTimeout } from '@/common/cacheRequest';
import { CoinMarketPrice, CoinMarketToken } from '@/interfaces/Markets.interface';
import proxyCoinMarket from 'API/coinmarket/proxyCoinMarket';
import { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/v1/cryptocurrency/listings/latest';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const firstSliceRequest = proxyCoinMarket<CoinMarketPrice[]>(endpoint, { limit: '5000' }, CacheTimeout.ONE_DAY);
  const secondSliceRequest = proxyCoinMarket<CoinMarketPrice[]>(
    endpoint,
    { limit: '5000', start: '5000' },
    CacheTimeout.ONE_DAY
  );
  const [firstSlice, secondSlice] = await Promise.all([firstSliceRequest, secondSliceRequest]);
  const tokens: CoinMarketToken[] = [...firstSlice.data, ...secondSlice.data].map(token => ({
    id: token.id,
    symbol: token.symbol,
    name: token.name,
  }));

  return res.json(tokens);
};

export default handler;
