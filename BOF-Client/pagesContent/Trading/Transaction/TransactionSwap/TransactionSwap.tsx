import React, { useEffect } from 'react';
import Table from '@/components/Table/Table';
import style from './TransactionSwap.module.css';
import { transactionTableHead } from './TransactionSwap.config';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { updateSwaps } from '@/redux/swapSlice';
import useMultilingual from '@/hooks/useMultilingual';
import { useWeb3React } from '@web3-react/core';

const TransactionSwap = () => {
  const { t } = useMultilingual('transaction');

  const dispatch = useAppDispatch();

  const { account: clientAddress } = useWeb3React();

  const chainId = useAppSelector(({ app }) => app.chainId);
  const tokens = useAppSelector(({ widget }) => widget.tokensList);
  const swaps = useAppSelector(({ swap }) => swap.swaps);

  useEffect(() => {
    dispatch(updateSwaps());
  }, [clientAddress, chainId, tokens]);

  return (
    <>
      {!!swaps?.length && (
        <div className={`${style.wrapper} boxStyle`}>
          <div className={style.header}>
            <h3 className={style.title}>{t('swapTitle')}</h3>
          </div>
          <div className={`${style.tableWrapper}`}>
            <Table
              tableHead={transactionTableHead}
              tableBody={swaps}
              onActionClick={() => {
                return;
              }}
              rowsLimit={false}
              minWidth="800px"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(TransactionSwap);
