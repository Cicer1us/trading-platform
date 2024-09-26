import { ClassNameType, ITableHead, ValueTypeEnum } from '@/interfaces/TableHead.interface';
import { CheckDollarTokens } from '@/helpers/CheckDollarTokens';
import { chains } from 'connection/chainConfig';
import { HashColumn } from '@/interfaces/TransactionTable.interface';
import { LimitOrderStatus } from '@/interfaces/Limit.interface';

function calculateLimitStatusStyle(status: LimitOrderStatus): ClassNameType {
  if (status === LimitOrderStatus.OPEN) {
    return 'yellowWithoutUnderlineColor';
  }
  if (status === LimitOrderStatus.CANCELLED) {
    return 'redColor';
  }
  if (status === LimitOrderStatus.FILLED) {
    return 'greenColor';
  }
  if (status === LimitOrderStatus.CANCELLING) {
    return 'violetUnderlinedColor';
  }
  return 'violetColor';
}

function calculateLimitStatusTag(columnValue: string) {
  const [status, link] = columnValue.split('|');
  if (status === LimitOrderStatus.OPEN || status === LimitOrderStatus.EXPIRED) {
    return <span>{status}</span>;
  }

  return (
    <a title={columnValue} href={`${link}`} target="_blank" rel="noreferrer">
      {status}
    </a>
  );
}

export const transactionTableLimitHead: Array<ITableHead> = [
  {
    alias: 'sentToken',
    name: 'Sent',
    type: ValueTypeEnum.TOKEN,
    sort: false,
    helperText: 'sentLimitHelper',
    withIcon: true,
    digitToRound: 6,
    _isCheckBy: {
      params: ['sent'],
      calc: value => CheckDollarTokens(value?.split('/')[0]),
    },
  },
  {
    alias: 'receivedToken',
    name: 'Received asset',
    helperText: 'receivedLimitHelper',
    type: ValueTypeEnum.TOKEN,
    sort: false,
    withIcon: true,
    digitToRound: 6,
    _isCheckBy: {
      params: ['received'],
      calc: value => CheckDollarTokens(value?.split('/')[0]),
    },
  },
  {
    alias: 'feesUSD',
    name: 'Fees',
    type: ValueTypeEnum.STRING,
    sort: false,
    helperText: 'feeLimitHelper',
    digitToRound: 2,
    ifCheckTrueShowPrefix: '$',
    showTokenName: true,
  },
  {
    alias: 'date',
    name: 'Opening time',
    helperText: 'openingHelper',
    type: ValueTypeEnum.DATE,
    sort: false,
  },
  {
    alias: 'expiredAt',
    name: 'Closing time',
    helperText: 'closingHelper',
    type: ValueTypeEnum.DATE,
    sort: false,
  },
  {
    alias: 'status',
    name: 'Status',
    helperText: 'statusLimitHelper',
    type: ValueTypeEnum.LINK,
    sort: false,
    _addStyleRule: {
      params: ['status'],
      calc: status => calculateLimitStatusStyle(status as LimitOrderStatus),
    },
    link: calculateLimitStatusTag,
    _addValueRule: {
      params: ['hash', 'status'],
      calc: (h, status) => {
        const hash = h as HashColumn;
        const link = `${chains[hash?.chainId].explorerUrl}/tx/${hash?.hash}`;
        return `${status}|${link}`;
      },
    },
  },
  {
    alias: 'action',
    name: 'Action',
    helperText: 'actionHelper',
    type: ValueTypeEnum.ACTION,
    sort: false,
    _addValueRule: {
      params: ['hash', 'status'],
      calc: (hash, status) => {
        if (status === LimitOrderStatus.OPEN) {
          return 'Close';
        }
        return `Unavailable`;
      },
    },
    _addStyleRule: {
      params: ['status'],
      calc: status => {
        if (status === LimitOrderStatus.OPEN) {
          return 'redColor';
        }
        return 'disable';
      },
    },
  },
];
