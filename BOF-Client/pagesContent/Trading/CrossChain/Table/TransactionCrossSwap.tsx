import React, { useEffect } from 'react';
import Table from '@/components/Table/Table';
import style from './TransactionCrossSwap.module.css';
import { transactionTableHead } from './TransactionCrossSwap.config';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { updateCrossSwaps, updatePendingCrossSwaps } from '@/redux/crossChainSlice';
import useMultilingual from '@/hooks/useMultilingual';
import { useWeb3React } from '@web3-react/core';
import CrossChainSwap from '../Components/CrossChainSwap/CrossChainSwap';
import { chains } from 'connection/chainConfig';
import { CrossChainSwapRow, CrossChainTxStatus } from '@/interfaces/CrossChain.interface';

const TransactionCrossSwap = () => {
  const { t } = useMultilingual('transaction');

  const dispatch = useAppDispatch();

  const { account: clientAddress } = useWeb3React();

  const chainId = useAppSelector(({ app }) => app.chainId);
  const tokens = useAppSelector(({ widget }) => widget.tokensList);
  const crossChainSwapsHistory = useAppSelector(({ crossChain }) => crossChain.crossChainSwaps);
  const nativeTokenUsdPrices = useAppSelector(({ crossChain }) => crossChain.nativeTokenUsdPrices);

  useEffect(() => {
    dispatch(updateCrossSwaps());
  }, [clientAddress, chainId, tokens, nativeTokenUsdPrices]);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updatePendingCrossSwaps());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {
        <div className={`${style.wrapper} boxStyle`}>
          <div className={style.header}>
            <h3 className={style.title}>{t('swapTitle')}</h3>
          </div>
          <div className={`${style.tableWrapper}`}>
            {!!crossChainSwapsHistory?.length && (
              <Table
                tableHead={transactionTableHead}
                tableBody={crossChainSwapsHistory}
                onActionClick={() => {
                  return;
                }}
                rowsLimit={false}
                minWidth="800px"
                withSubInfo={true}
                SubInfoComponent={SubInfoComponent}
              />
            )}
          </div>
        </div>
      }
    </>
  );
};

const SubInfoComponent = ({ row }: { row: CrossChainSwapRow }) => {
  const { t } = useMultilingual('transaction');

  const getTitle = () => {
    if (row?.status === CrossChainTxStatus.FIRST_TX_PENDING) {
      return t('firstTxPending');
    }
    if (row?.status === CrossChainTxStatus.SECOND_TX_PENDING) {
      return t('secondTxPending');
    }
    if (row?.status === CrossChainTxStatus.FIRST_TX_REJECTED) {
      return t('firstTxRejected');
    }
    return t('swapCompleted');
  };

  return (
    <div className={style.crossChainSwap}>
      <div className={style.crossChainSwapTitle}>{getTitle()}</div>
      <CrossChainSwap
        srcTxLink={row.srcHash?.hash ? `${chains[row?.srcHash?.chainId].explorerUrl}/tx/${row?.srcHash?.hash}` : null}
        destTxLink={
          row.destHash?.hash ? `${chains[row?.destHash?.chainId].explorerUrl}/tx/${row?.destHash?.hash}` : null
        }
        status={row.status}
        srcToken={row.srcToken}
        destToken={row.destToken}
        srcTxFee={row.srcTxFee}
        destTxFee={row.destTxFee}
        srcTxFeeUsd={row.srcTxFeeUsd}
        destTxFeeUsd={row.destTxFeeUsd}
        route={row.swap.route}
      />
    </div>
  );
};

export default React.memo(TransactionCrossSwap);
