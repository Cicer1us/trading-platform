import { ITableHead, ValueTypeEnum } from '@/interfaces/TableHead.interface';

// Average open || Average close || PL || Status || Time

export const ordersTableConfig: Array<ITableHead> = [
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
    alias: 'filled',
    name: 'Filled',
    type: ValueTypeEnum.STRING,
    sort: false,
    translateName: 'filled',
    helperText: 'filledHelper',
  },
  {
    alias: 'price',
    name: 'Price',
    type: ValueTypeEnum.NUMBER,
    additionalSymbolLeft: '$',
    sort: false,
    translateName: 'price',
  },
  {
    alias: 'trigger',
    name: 'Trigger',
    type: ValueTypeEnum.NUMBER,
    additionalSymbolLeft: '$',
    sort: false,
    helperText: 'triggerPriceLeverageHelper',
    translateName: 'triggerPrice',
    _addValueRule: {
      params: ['trigger'],
      calc: trigger => (Number(trigger) > 0 ? trigger.toString() : '-'),
    },
  },
  {
    alias: 'orderType',
    name: 'Type',
    type: ValueTypeEnum.STRING,
    sort: false,
    translateName: 'type',
  },
  {
    alias: 'goodTillTime',
    name: 'goodTillTime',
    type: ValueTypeEnum.STRING,
    sort: false,
    translateName: 'goodTillTime',
    helperText: 'goodTillTimeHelper',
  },
  {
    alias: 'action',
    name: 'Action',
    helperText: 'actionLeverageHelper',
    translateName: 'action',
    type: ValueTypeEnum.ACTION,
    sort: false,
    isTranslate: true,
    _addValueRule: {
      params: [],
      calc: () => 'Cancel',
    },
    _addStyleRule: {
      params: [],
      calc: () => {
        return 'redColor';
      },
    },
  },
];
