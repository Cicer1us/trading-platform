import React, { useEffect, useState } from 'react';
import getCurrencyChartData from 'API/chart/getCurrencyChartData';
import dayjs from 'dayjs';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import useMultilingual from '@/hooks/useMultilingual';
import { Chains, chains } from 'connection/chainConfig';
import getNativeTokenChartData from 'API/chart/getNativeTokenChartData';
import { ChartTimeFrame } from '@/components/ChartLine/ChartLine';
import ChartContainer from '@/components/ChartContainer/ChartContainer';
import { CoinGeckoPriceResponse } from '@/interfaces/Coingecko.interface';
import useWindowSize from '@/hooks/useWindowSize';
import { Token } from '@/interfaces/Tokens.interface';
export interface ChartPriceData {
  date: string;
  price: number;
}

export enum SelectedChartType {
  FIRST_TO_SECOND = 'FIRST_TO_SECOND',
  SECOND_TO_FIRST = 'SECOND_TO_FIRST',
  ONLY_FIRST = 'ONLY_FIRST',
  ONLY_SECOND = 'ONLY_SECOND',
}

const getChartOptions = (tokenA: string, tokenB: string) => {
  if (!tokenA || !tokenB) return [];
  return [
    { value: SelectedChartType.FIRST_TO_SECOND, title: `${tokenA} / ${tokenB}` },
    { value: SelectedChartType.SECOND_TO_FIRST, title: `${tokenB} / ${tokenA}` },
    { value: SelectedChartType.ONLY_FIRST, title: tokenA },
    { value: SelectedChartType.ONLY_SECOND, title: tokenB },
  ];
};

const Chart = () => {
  const { t } = useMultilingual('chart');

  const tokens = useAppSelector(({ widget }) => widget.tokensList);

  const tokenA = useAppSelector(({ widget }) => widget.selectedTokenA);
  const tokenB = useAppSelector(({ widget }) => widget.selectedTokenB);

  const windowSize = useWindowSize();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<ChartTimeFrame>(ChartTimeFrame.DAY);
  const [selectedChartType, setSelectedChartType] = useState<SelectedChartType>(SelectedChartType.FIRST_TO_SECOND);

  const [firstTokenData, setFirstTokenData] = useState<ChartPriceData[]>(null);
  const [secondTokenData, setSecondTokenData] = useState<ChartPriceData[]>(null);

  useEffect(() => {
    if (Object.keys(tokens).length && tokenA && tokenB) {
      setIsLoading(true);
      updateChartData();
    }
  }, [tokens, timeFrame, tokenA, tokenB]);

  const getCurrentInterval = (): [number, number] => {
    const currentDate = new Date();
    const fromDate = new Date();
    if (timeFrame === ChartTimeFrame.DAY) {
      fromDate.setDate(fromDate.getDate() - 1);
    }
    if (timeFrame === ChartTimeFrame.WEEK) {
      fromDate.setDate(fromDate.getDate() - 7);
    }
    if (timeFrame === ChartTimeFrame.MONTH) {
      fromDate.setMonth(fromDate.getMonth() - 1);
    }
    return [fromDate.getTime() / 1000, currentDate.getTime() / 1000];
  };

  const getChartData = async (token: Token) => {
    const nativeToken = chains[token?.chainId].nativeToken;

    if (token?.address === nativeToken.address) {
      return getNativeChartData(token.chainId);
    }

    return getTokenChartData(token?.address, chains[token?.chainId].coingeckoChain);
  };

  const updateChartData = async (): Promise<void> => {
    if (
      selectedChartType === SelectedChartType.FIRST_TO_SECOND ||
      selectedChartType === SelectedChartType.SECOND_TO_FIRST
    ) {
      const firstTokenRequests = getChartData(tokenA);
      const secondTokenRequests = getChartData(tokenB);
      const [firstTokenData, secondTokenData] = await Promise.all([firstTokenRequests, secondTokenRequests]);
      setFirstTokenData(firstTokenData);
      setSecondTokenData(secondTokenData);
    } else if (selectedChartType) {
      const token = selectedChartType === SelectedChartType.ONLY_FIRST ? tokenA : tokenB;
      const tokenData = await getChartData(token);
      if (selectedChartType === SelectedChartType.ONLY_FIRST) {
        setFirstTokenData(tokenData);
      } else {
        setSecondTokenData(tokenData);
      }
    }
    setIsLoading(false);
  };

  const formatData = (res: CoinGeckoPriceResponse): ChartPriceData[] => {
    return res.prices.map(data => ({
      date: dayjs(data[0]).format('HH:mm MMM D'),
      price: data[1],
    }));
  };

  const mergeTokensData = (firstTokenData: ChartPriceData[], secondTokenData: ChartPriceData[]): ChartPriceData[] => {
    if (!firstTokenData || !secondTokenData) return [];
    const minLength = Math.min(firstTokenData.length, secondTokenData.length);
    const firstToken = firstTokenData.slice(0, minLength);
    const secondToken = secondTokenData.slice(0, minLength);

    return firstToken.map((data, index) => ({
      date: data.date,
      price: data.price / secondToken[index].price,
    }));
  };

  const getTokenChartData = async (address: string, coingeckoChain: string): Promise<ChartPriceData[]> => {
    const activeInterval = getCurrentInterval();
    const res = await getCurrencyChartData(activeInterval, coingeckoChain, address);
    if (res) return formatData(res);
    return [];
  };

  const getNativeChartData = async (chainId: Chains): Promise<ChartPriceData[]> => {
    const activeInterval = getCurrentInterval();
    const nativeToken = chains[chainId].nativeToken.coingeckoId;
    const res = await getNativeTokenChartData(activeInterval, nativeToken);
    if (res) return formatData(res);
    return [];
  };

  const getChartPercentChange = (data: ChartPriceData[]): number => {
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

  const getData = () => {
    if (selectedChartType === SelectedChartType.FIRST_TO_SECOND) {
      return mergeTokensData(firstTokenData, secondTokenData);
    }

    if (selectedChartType === SelectedChartType.SECOND_TO_FIRST) {
      return mergeTokensData(secondTokenData, firstTokenData);
    }

    if (selectedChartType === SelectedChartType.ONLY_FIRST) {
      return firstTokenData;
    }

    if (selectedChartType === SelectedChartType.ONLY_SECOND) {
      return secondTokenData;
    }

    return null;
  };

  const data = getData();
  const percentChange = getChartPercentChange(data);
  const options = getChartOptions(tokenA?.symbol, tokenB?.symbol);
  const pastTitle = getPastTitle();
  const height = windowSize.width < 768 ? 295 : 480;

  return (
    <ChartContainer
      height={height}
      options={options}
      data={data}
      handlerSelected={setSelectedChartType}
      selectedOption={selectedChartType}
      timeFrame={timeFrame}
      isLoading={isLoading}
      setTimeFrame={setTimeFrame}
      pastTitle={pastTitle}
      percentChange={percentChange}
    />
  );
};

export default Chart;
