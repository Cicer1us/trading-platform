import { BASIC_LEVERAGE_TOKEN } from '@/common/LeverageTradeConstants';
import { BlockList, BlockItem, BlockTitleItem } from '@/components/BlockList/BlockList';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { setSelectTokenModal, SelectTokenModal } from '@/redux/widgetSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { BarLoader } from 'react-spinners';
import dayjs from 'dayjs';
import { getMarketBySymbol } from '@/common/dydxHelpers';
import MetaTags from '@/components/MetaTags/MetaTags';
import useMultilingual from '@/hooks/useMultilingual';

export const LeveragePairInformation = () => {
  const { tc: tcMetadata } = useMultilingual('tradingMetadata');

  const dispatch = useDispatch();
  const selectedMarket = useAppSelector(({ leverage }) => leverage?.selectedMarket);
  const markets = useAppSelector(({ dydxData }) => dydxData?.markets);
  const currentMarket = getMarketBySymbol(selectedMarket);
  const price = useAppSelector(({ dydxData }) => {
    const lastTimeUpdatedMinutesAgo = dayjs().diff(dayjs(dydxData?.lastTrades?.[currentMarket]?.createdAt), 'seconds');
    let price;
    if (lastTimeUpdatedMinutesAgo > 60) {
      price = dydxData?.markets?.[currentMarket].indexPrice;
    } else {
      price = dydxData?.lastTrades?.[currentMarket]?.price;
    }
    if (!price) {
      return '-';
    }
    return Number(price).toFixed(2);
  });

  const indexPrice = Number(markets?.[currentMarket]?.indexPrice);
  const oraclePrice = Number(markets?.[currentMarket]?.oraclePrice);
  const priceChange24H = Number(markets?.[currentMarket]?.priceChange24H);
  const volume24H = Number(markets?.[currentMarket]?.volume24H);
  const funding1H = Number(Number(markets?.[currentMarket]?.nextFundingRate) * 100);

  const onClick = () => dispatch(setSelectTokenModal(SelectTokenModal.FIRST_INPUT));
  const priceChangeColor = (price: number | undefined) => {
    if (!price) {
      return 'white';
    } else if (price > 0) {
      return 'green';
    } else if (price < 0) {
      return 'red';
    }
    return 'white';
  };
  const priceChange24HPercentage = () => {
    const price = indexPrice;
    const change = Math.abs(priceChange24H);
    return (change / price) * 100;
  };
  return (
    <>
      <MetaTags
        title={tcMetadata('leverageTitle')([price, markets?.[currentMarket]?.market ?? '-'])}
        description={tcMetadata('leverageDescription')([markets?.[currentMarket]?.market])}
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.come/trading`}
      />

      <BlockList>
        {!markets ? (
          <BarLoader color={'var(--green)'} loading={true} width={'100%'} />
        ) : (
          <>
            <BlockTitleItem
              iconSymbols={[selectedMarket, BASIC_LEVERAGE_TOKEN]}
              onClick={onClick}
              title={`${selectedMarket}/${BASIC_LEVERAGE_TOKEN}`}
              content={price}
              contentState={priceChangeColor(priceChange24H)}
              prefix="$"
            />
            <BlockItem title="24h Volume" content={volume24H.toFixed(2)} prefix="$" />
            <BlockItem title="Oracle Price" content={oraclePrice.toFixed(2)} prefix="$" />
            <BlockItem title="1h Funding" content={funding1H.toFixed(6)} suffix="%" />
            <BlockItem
              title="24h Change"
              content={priceChange24H.toFixed(2)}
              contentState={priceChangeColor(priceChange24H)}
              prefix="$"
              suffix={` (${priceChange24HPercentage().toFixed(2)}%)`}
            />
          </>
        )}
      </BlockList>
    </>
  );
};
