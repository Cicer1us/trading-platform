import { ITableHead, ValueTypeEnum } from '@/interfaces/TableHead.interface';

export const tradesTableConfig: Array<ITableHead> = [
  {
    alias: 'pair',
    name: 'Pair',
    type: ValueTypeEnum.PAIR,
    sort: false,
    translateName: 'pair',
  },
  {
    alias: 'side',
    name: 'Buy/Sell',
    type: ValueTypeEnum.STRING,
    sort: false,
    translateName: 'buySell',
    helperText: 'sideLevHelperText',
    isTranslate: true,
    _addValueRule: {
      params: ['side'],
      calc: status => {
        return status == 'SELL' ? `Sell` : 'Buy';
      },
    },
    _addStyleRule: {
      params: ['side'],
      calc: side => {
        return side === 'SELL' ? 'redColor' : 'greenColor';
      },
    },
  },
  {
    alias: 'amount',
    name: 'Amount',
    type: ValueTypeEnum.STRING,
    sort: false,
    helperText: 'leverageTradeAmountHelperText',
    translateName: 'amount',
  },
  {
    alias: 'price',
    name: 'Price',
    type: ValueTypeEnum.NUMBER,
    additionalSymbolLeft: '$',
    sort: false,
    helperText: 'leverageTradePriceHelperText',
    translateName: 'price',
  },
  {
    alias: 'total',
    name: 'Total',
    type: ValueTypeEnum.NUMBER,
    additionalSymbolLeft: '$',
    sort: false,
    helperText: 'leverageTradeTotalHelperText',
    translateName: 'total',
  },
  {
    alias: 'fee',
    name: 'Total',
    type: ValueTypeEnum.NUMBER,
    additionalSymbolLeft: '$',
    sort: false,
    helperText: 'leverageTradeTotalHelperText',
    translateName: 'fee',
  },
  {
    alias: 'orderType',
    name: 'Type',
    type: ValueTypeEnum.STRING,
    sort: false,
    helperText: 'leverageTradeOrderTypeHelperText',
    translateName: 'type',
  },
  {
    alias: 'closedAt',
    name: 'time',
    type: ValueTypeEnum.DATE,
    sort: false,
    translateName: 'time',
  },
];
