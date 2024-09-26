import { ITableHead, ValueTypeEnum } from '@/interfaces/TableHead.interface';

export const openedPositionsTableConfig: Array<ITableHead> = [
  {
    alias: 'pair',
    name: 'Pair',
    type: ValueTypeEnum.PAIR,
    sort: false,
    translateName: 'pair',
  },
  {
    alias: 'leverage',
    name: 'Leverage',
    type: ValueTypeEnum.STRING,
    additionalSymbolLeft: 'x',
    sort: false,
    helperText: 'levHelperText',
    translateName: 'leverage',
  },
  {
    alias: 'side',
    name: 'Buy/Sell',
    type: ValueTypeEnum.STRING,
    sort: false,
    helperText: 'sideLevHelperText',
    translateName: 'buySell',
    isTranslate: true,
    _addValueRule: {
      params: ['side'],
      calc: side => {
        return side == 'SHORT' ? `Sell` : 'Buy';
      },
    },
    _addStyleRule: {
      params: ['side'],
      calc: side => {
        return side === 'SHORT' ? 'redColor' : 'greenColor';
      },
    },
  },
  {
    alias: 'pl',
    name: 'Profit/Loss',
    type: ValueTypeEnum.PL_ACTION,
    additionalSymbolLeft: '$',
    sort: false,
    digitToRound: 10,
    _addStyleRule: {
      params: ['pl'],
      calc: change => (Number(change) > 0 ? 'greenColor' : 'redColor'),
    },
    helperText: 'profitLossHelperText',
    translateName: 'profitLoss',
  },
  {
    alias: 'position',
    name: 'Position',
    type: ValueTypeEnum.STRING,
    sort: false,
    helperText: 'positionHelperText',
    translateName: 'position',
  },
  {
    alias: 'status',
    name: 'Status',
    type: ValueTypeEnum.STRING,
    sort: false,
    _addStyleRule: {
      params: [],
      calc: () => 'yellowColor',
    },
    helperText: 'statusLevHelperText',
    translateName: 'status',
    isTranslate: true,
    _addValueRule: {
      params: ['status'],
      calc: (status: string) => {
        return status.charAt(0) + status.slice(1).toLowerCase();
      },
    },
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
      params: ['status'],
      calc: status => {
        return status == 'OPEN' ? `Close` : null;
      },
    },
    _addStyleRule: {
      params: [],
      calc: () => {
        return 'redColor';
      },
    },
  },
  {
    alias: 'subInfo',
    name: '',
    type: ValueTypeEnum.DROPDOWN,
    sort: false,
  },
];
