import { ITableHead, ValueTypeEnum } from '@/interfaces/TableHead.interface';

export const MarketTableConfig: Array<ITableHead> = [
  {
    alias: 'token',
    name: 'Name',
    type: ValueTypeEnum.TOKEN,
    sort: false,
    showTokenName: true,
    withIcon: true,
    iconSize: 24,
  },
  {
    alias: 'price',
    name: 'Price',
    type: ValueTypeEnum.NUMBER,
    sort: true,
    additionalSymbolLeft: '$',
    digitToRound: 2,
  },
  {
    alias: 'percent_change_24h',
    name: '24h',
    type: ValueTypeEnum.NUMBER,
    sort: true,
    additionalSymbolRight: '%',
    digitToRound: 2,
    _addStyleRule: {
      params: ['percent_change_24h'],
      calc: percent_change_24h => {
        return Number(percent_change_24h) < 0 ? 'redColor' : 'greenColor';
      },
    },
  },
  {
    alias: 'percent_change_7d',
    name: '7d',
    type: ValueTypeEnum.NUMBER,
    sort: false,
    additionalSymbolRight: '%',
    digitToRound: 2,
    _addStyleRule: {
      params: ['percent_change_7d'],
      calc: percent_change_7d => {
        return Number(percent_change_7d) < 0 ? 'redColor' : 'greenColor';
      },
    },
  },
  {
    alias: 'market_cap',
    name: 'Market Cap',
    type: ValueTypeEnum.NUMBER,
    sort: true,
    additionalSymbolLeft: '$',
    digitToRound: 0,
  },
  {
    alias: 'chains',
    name: 'Networks',
    type: ValueTypeEnum.CHAINS,
    sort: false,
  },
];
