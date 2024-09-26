import { ChartPriceData } from '@/components/Chart/Chart';
import ChartContainer from '@/components/ChartContainer/ChartContainer';
import { ChartTimeFrame } from '@/components/ChartLine/ChartLine';
import useMultilingual from '@/hooks/useMultilingual';
import { CoinMarketMetadata } from '@/interfaces/Markets.interface';
import fetchHistoricalMarkets from 'API/markets/getHistoricalMarkets';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

interface MarketChartProps {
  metadata: CoinMarketMetadata;
}

export const MarketChart: React.FC<MarketChartProps> = ({ metadata }) => {
  const { t } = useMultilingual('chart');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<ChartTimeFrame>(ChartTimeFrame.DAY);
  const [data, setData] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    updateChartData();
  }, [metadata, timeFrame]);

  const getCurrentInterval = (): [from: string, to: string, interval: string] => {
    const today = new Date();

    if (timeFrame === ChartTimeFrame.MONTH) {
      const to = dayjs(today);
      const from = to.subtract(1, 'month');
      return [from.toISOString(), to.toISOString(), 'hourly'];
    }

    if (timeFrame === ChartTimeFrame.WEEK) {
      const to = dayjs(today);
      const from = to.subtract(1, 'week');
      return [from.toISOString(), to.toISOString(), 'hourly'];
    }

    if (timeFrame === ChartTimeFrame.DAY) {
      const to = dayjs(today);
      const from = to.subtract(1, 'day');
      return [from.toISOString(), to.toISOString(), 'hourly'];
    }
  };

  const updateChartData = async () => {
    const [time_start, time_end, interval] = getCurrentInterval();
    const query = { id: metadata.id.toString(), time_start, time_end, interval, time_period: interval };
    const historicalMarket = await fetchHistoricalMarkets(query);
    if (historicalMarket?.data?.quotes) {
      const data: ChartPriceData[] = historicalMarket?.data?.quotes.map(quote => ({
        price: quote.quote.USD.close,
        date: dayjs(quote.quote.USD.timestamp).format('HH:mm MMM D'),
      }));
      setData(data);
    } else {
      setData([]);
    }

    setIsLoading(false);
  };

  const getChartPercentChange = (): number => {
    if (!data) return 0;
    const to = data[data?.length - 1]?.price ?? 1;
    const from = data[0]?.price ?? 1;
    return ((to - from) / from) * 100;
  };

  const getPastTitle = (): string => {
    if (timeFrame === ChartTimeFrame.DAY) {
      return t('pastDay');
    }
    if (timeFrame === ChartTimeFrame.WEEK) {
      return t('pastWeek');
    }
    if (timeFrame === ChartTimeFrame.MONTH) {
      return t('pastMonth');
    }
  };

  const percentChange = getChartPercentChange();
  const pastTitle = getPastTitle();

  return (
    <ChartContainer
      height={300}
      options={null}
      data={data}
      timeFrame={timeFrame}
      isLoading={isLoading}
      setTimeFrame={setTimeFrame}
      pastTitle={pastTitle}
      percentChange={percentChange}
    />
  );
};
