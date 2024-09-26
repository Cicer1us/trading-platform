import client from '@/helpers/contentful';
import { CmsArticle } from '@/interfaces/CMS.interface';
import { CryptoPanicPost } from '@/interfaces/Cryptopanic.interface';
import { CoinMarketGlobal, CoinMarketTrending } from '@/interfaces/Markets.interface';
import AppLayout from '@/layouts/AppLayout/AppLayout';
import { getMarkets } from 'pages/api/markets/index';
import { MARKETS_TABLE_ROWS } from 'constants/markets';
import { Entry } from 'contentful';
import { getMarketNews } from 'pages/api/markets/news';
import Markets from 'pagesContent/Markets/Markets';
import { getTrendingMarkets } from 'pages/api/markets/trending';
import { MarketsTableData } from 'pagesContent/Markets/MarketsTable/MarketsTable';
import { getMarketGlobal } from 'pages/api/markets/global';
import MetaTags from '@/components/MetaTags/MetaTags';
import { MARKETS } from '@/common/LocationPath';
import useMultilingual from '@/hooks/useMultilingual';

export const getServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
  try {
    const articlesEntries = await client.getEntries<CmsArticle>({
      content_type: 'articles',
      locale: 'en-US',
      order: '-sys.createdAt',
    });
    return {
      props: {
        trending: await getTrendingMarkets({ limit: '5' }),
        markets: await getMarkets({ limit: MARKETS_TABLE_ROWS.toString() }),
        news: await getMarketNews(),
        global: await getMarketGlobal(),
        articles: articlesEntries?.items ?? [],
      },
    };
  } catch (error) {
    console.error(error.message);
    return { props: { trending: {}, markets: { data: [], totalCount: 0 }, news: [], articles: [], global: {} } };
  }
};

interface MarketsPageProps {
  trending: CoinMarketTrending;
  markets: MarketsTableData;
  news: CryptoPanicPost[];
  articles: Entry<CmsArticle>[];
  global: CoinMarketGlobal;
}

const MarketsPage: React.FC<MarketsPageProps> = ({ news, trending, markets, articles, global }: MarketsPageProps) => {
  const { t } = useMultilingual('markets');
  return (
    <>
      <MetaTags
        title={t('title')}
        description={t('description')}
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.come/${MARKETS}`}
      />
      <AppLayout>
        <Markets trending={trending} news={news} markets={markets} articles={articles} global={global} />
      </AppLayout>
    </>
  );
};

export default MarketsPage;
