import { ITableHead, ValueTypeEnum } from '@/interfaces/TableHead.interface';
import { CheckDollarTokens } from '@/helpers/CheckDollarTokens';
import { chains } from 'connection/chainConfig';
import { HashColumn } from '@/interfaces/TransactionTable.interface';

export const transactionTableHead: Array<ITableHead> = [
  {
    alias: 'sentToken',
    name: 'Sent',
    type: ValueTypeEnum.TOKEN,
    sort: false,
    helperText: 'sentHelper',
    withIcon: true,
    digitToRound: 6,
    _isCheckBy: {
      params: ['sent'],
      calc: value => CheckDollarTokens(value?.split('/')[0]),
    },
  },
  {
    alias: 'receivedToken',
    name: 'Received',
    type: ValueTypeEnum.TOKEN,
    sort: false,
    helperText: 'receivedHelper',
    withIcon: true,
    digitToRound: 6,
    _isCheckBy: {
      params: ['received'],
      calc: value => CheckDollarTokens(value?.split('/')[0]),
    },
  },
  {
    alias: 'protocolFee',
    name: 'Protocol Fees',
    type: ValueTypeEnum.STRING,
    sort: false,
    helperText: 'protocolFeeHelper',
    digitToRound: 4,
  },
  {
    alias: 'gasFee',
    name: 'Gas Fees',
    type: ValueTypeEnum.STRING,
    sort: false,
    helperText: 'gasFeeHelper',
    digitToRound: 2,
  },
  // Temporarily hide feesUSD column
  /*
  {
    alias: 'feesUSD',
    name: 'Fees',
    type: ValueTypeEnum.STRING,
    sort: false,
    helperText: 'feeHelper',
    _isCheckBy: {
      params: ['fee'],
      calc: value => CheckDollarTokens(value?.split('/')[0]),
    },
    digitToRound: 2,
    ifCheckTrueShowPrefix: '$',
    showTokenName: true,
  },
  */
  {
    alias: 'date',
    name: 'Date',
    type: ValueTypeEnum.DATE,
    sort: false,
    helperText: 'dateHelper',
  },
  {
    alias: 'confirmed',
    name: 'Status',
    helperText: 'statusHelper',
    type: ValueTypeEnum.LINK,
    sort: false,
    _addStyleRule: {
      params: ['confirmed'],
      calc: confirmed => (confirmed ? 'greenColor' : 'yellowColor'),
    },
    link: columnValue => (
      <a title={columnValue} href={`${columnValue.split('|')[1]}`} target="_blank" rel="noreferrer">
        {columnValue.split('|')[0]}
      </a>
    ),
    _addValueRule: {
      params: ['hash', 'confirmed'],
      calc: (h, confirmed) => {
        const hash = h as HashColumn;
        const link = `${chains[hash?.chainId].explorerUrl}/tx/${hash?.hash}`;
        return `${confirmed ? 'Done' : 'Pending'}|${link}`;
      },
    },
  },
];
