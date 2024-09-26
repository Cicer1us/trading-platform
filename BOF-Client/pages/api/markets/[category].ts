import { CacheTimeout } from '@/common/cacheRequest';
import { CoinMarketCategory } from '@/interfaces/Markets.interface';
import proxyCoinMarket from 'API/coinmarket/proxyCoinMarket';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { category, ...query } = req.query as { category: string };
  const endpoint = `/v1/cryptocurrency/category`;

  const response = await proxyCoinMarket<CoinMarketCategory>(
    endpoint,
    { ...query, id: category },
    CacheTimeout.FIVE_MIN
  );
  return res.json(response);
};

export default handler;
