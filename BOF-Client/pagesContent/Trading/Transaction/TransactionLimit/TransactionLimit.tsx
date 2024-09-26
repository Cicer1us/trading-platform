import React, { useEffect, useState } from 'react';
import Table from '@/components/Table/Table';
import style from './TransactionLimit.module.css';
import { transactionTableLimitHead } from './TransactionLimit.config';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { updateLimitOrders } from '@/redux/limitSlice';
import { LimitOrderStatus, LimitOrder } from '@/interfaces/Limit.interface';
import Modal from '@/components/Modal/Modal';
import CancelLimitOrderModal from './CancelOrderModal/CancelLimitOrderModal';
import useMultilingual from '@/hooks/useMultilingual';
import { useWeb3React } from '@web3-react/core';

const TransactionLimit = () => {
  const { t } = useMultilingual('transaction');

  const [cancelModalIsOpen, setModalOpen] = useState<boolean>(false);
  const [orderToCancel, setOrderToCancel] = useState<LimitOrder>(null);
  const dispatch = useAppDispatch();
  const tokens = useAppSelector(({ widget }) => widget.tokensList);
  const limitOrders = useAppSelector(({ limit }) => limit.limitOrders);
  const { account: clientAddress } = useWeb3React();

  useEffect(() => {
    dispatch(updateLimitOrders());
  }, [clientAddress, tokens]);

  const onCancel = (order: LimitOrder) => {
    if (order.status === LimitOrderStatus.OPEN && Number(order.raw.expiry) > Date.now() / 1000) {
      setOrderToCancel(order);
      setModalOpen(true);
    }
  };

  return (
    <>
      {!!limitOrders?.length && (
        <div className={`${style.wrapper} boxStyle`}>
          <div className={style.header}>
            <h3 className={style.title}>{t('limitTitle')}</h3>
          </div>
          <div className={`${style.tableWrapper}`}>
            <Table
              tableHead={transactionTableLimitHead}
              tableBody={limitOrders}
              onActionClick={onCancel}
              rowsLimit={false}
              minWidth="1000px"
            />
          </div>
        </div>
      )}

      <Modal active={cancelModalIsOpen} setActive={setModalOpen}>
        <CancelLimitOrderModal active={cancelModalIsOpen} setActive={setModalOpen} order={orderToCancel} />
      </Modal>
    </>
  );
};

export default React.memo(TransactionLimit);
