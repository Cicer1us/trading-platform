import { chains } from 'connection/chainConfig';
import { CrossChainTxStatus } from '@/interfaces/CrossChain.interface';
import { ITableHead, ValueTypeEnum } from '@/interfaces/TableHead.interface';
import { HashColumn } from '@/interfaces/TransactionTable.interface';
import style from './TransactionCrossSwap.module.css';

// TODO: use useMultilingual for column values
export const transactionTableHead: Array<ITableHead> = [
  {
    alias: 'srcTokenColumn',
    name: 'From',
    type: ValueTypeEnum.TOKEN,
    sort: false,
    helperText: 'fromHelper',
    withIcon: true,
    digitToRound: 9,
    showTokenName: true,
  },
  {
    alias: 'destTokenColumn',
    name: 'To',
    type: ValueTypeEnum.TOKEN,
    sort: false,
    helperText: 'toHelper',
    withIcon: true,
    showTokenName: true,
    digitToRound: 9,
  },
  {
    alias: 'date',
    name: 'Opening Time',
    type: ValueTypeEnum.DATE,
    sort: true,
    helperText: 'dateHelper',
  },
  {
    alias: 'destination',
    name: 'Destination',
    helperText: 'statusHelper',
    type: ValueTypeEnum.LINK,
    sort: false,
    link: columnValue => {
      const { src, dest } = columnValue;
      return (
        <div className={style.destinationColumn}>
          From
          <a href={`${src.link}`} target="_blank" rel="noreferrer" className={style.destinationLink}>
            {src.name}
          </a>
          To
          {dest.link ? (
            <a href={`${dest.link}`} target="_blank" rel="noreferrer" className={style.destinationLink}>
              {dest.name}
            </a>
          ) : (
            <span className={style.emptyLink}>{dest.name}</span>
          )}
        </div>
      );
    },
    _addValueRule: {
      params: ['srcHash', 'destHash'],
      calc: (srcHash, destHash) => {
        const src = srcHash as HashColumn;
        const dest = destHash as HashColumn;
        const srcLink = `${chains[src?.chainId].explorerUrl}/tx/${src?.hash}`;
        const destLink = dest?.hash ? `${chains[dest?.chainId].explorerUrl}/tx/${dest?.hash}` : '';
        return {
          src: {
            link: srcLink,
            name: chains[src?.chainId].name,
          },
          dest: {
            link: destLink,
            name: chains[dest?.chainId].name,
          },
        };
      },
    },
  },
  {
    alias: 'status',
    name: 'Status',
    helperText: 'statusHelper',
    type: ValueTypeEnum.STRING,
    sort: false,
    _addValueRule: {
      params: ['status'],
      calc: status => {
        if (status === CrossChainTxStatus.FIRST_TX_PENDING) {
          return 'First Transaction';
        }
        if (status === CrossChainTxStatus.FIRST_TX_REJECTED) {
          return 'Rejected';
        }
        if (status === CrossChainTxStatus.SECOND_TX_PENDING) {
          return 'Second Transaction';
        }
        return 'Completed';
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
