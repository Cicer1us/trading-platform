import React from 'react';
import { CoinMarketMetadata, CoinMarketPrice } from '@/interfaces/Markets.interface';
import AppLayout from '@/layouts/AppLayout/AppLayout';
import { getMarketPrice } from 'pages/api/markets/price';
import { getMarketMetadata } from 'pages/api/markets/metadata';
import Market from 'pagesContent/Market/Market';
import { MARKETS } from '@/common/LocationPath';
import MetaTags from '@/components/MetaTags/MetaTags';

export const getServerSideProps = async ({ params: { id }, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
  try {
    return {
      props: {
        price: await getMarketPrice({ id: id.toString() }),
        metadata: await getMarketMetadata({ id: id.toString() }),
      },
    };
  } catch (error) {
    console.error(error.message);
    return { props: { price: {}, metadata: {}, news: [] } };
  }
};

interface MarketPageProps {
  price: CoinMarketPrice;
  metadata: CoinMarketMetadata;
}

const MarketPage: React.FC<MarketPageProps> = ({ price, metadata }) => {
  return (
    <>
      <MetaTags
        title={metadata?.name}
        description={metadata?.description}
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.come/${MARKETS}/${metadata?.symbol}`}
      />
      <AppLayout>
        <Market metadata={metadata} price={price} />
      </AppLayout>
    </>
  );
};

export default MarketPage;
