import React, { useState } from 'react';
import Table from '@/components/Table/Table';
import style from './TransactionLeverage.module.css';
import useMultilingual from '@/hooks/useMultilingual';
import BeatLoader from 'react-spinners/BeatLoader';
import { ordersTableConfig } from './ordersTable.config';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import Modal from '@/components/Modal/Modal';
import CancelLeverageModal from './ModalWindows/CancelLeverageModal';
import { clientManager } from '@/common/DydxClientManager';
import { getHumanReadableOderType } from '@/common/dydxHelpers';

dayjs.extend(relativeTime);

const OrdersTable = () => {
  const { t } = useMultilingual('transaction');
  const [cancelModalIsOpen, setModalOpen] = useState<boolean>(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const [orderType, setOrderType] = useState<string>('-');
  const [market, setMarket] = useState<string>('-');
  const [price, setPrice] = useState<string>('-');
  const [triggerPrice, setTriggerPrice] = useState<string>('-');
  const [amount, setAmount] = useState<string>('-');

  const getGoodTillTime = expiresAt => {
    return dayjs(expiresAt).diff(dayjs(), 'day') > 1
      ? `${dayjs(expiresAt).diff(dayjs(), 'day')} ${t('days')}`
      : dayjs(expiresAt).toNow(true);
  };

  const orders = useAppSelector(({ dydxData }) => {
    const orders = [];

    for (const [, value] of Object.entries(dydxData.orders)) {
      orders.push({
        id: value.id,
        pair: `${value.market.substring(0, value.market.indexOf('-'))}/USDC`,
        side: value.side,
        amount: value.size,
        filled: Number(value.size) - Number(value.remainingSize),
        price: Number(value.price).toFixed(2),
        trigger: Number(value.triggerPrice).toFixed(2),
        orderType: getHumanReadableOderType(value.type),
        goodTillTime: getGoodTillTime(value.expiresAt),
      });
    }
    orders.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    return orders;
  });

  const requestOrderCancellation = async row => {
    setOrderToCancel(row.id);
    setOrderType(row.orderType);
    setMarket(row.pair);
    setPrice(row.price);
    setTriggerPrice(row.trigger);
    setAmount(row.amount);
    setModalOpen(true);
  };

  const cancelOrder = async () => {
    try {
      await clientManager.client.private.cancelOrder(orderToCancel);
    } catch (e) {
      console.error(e);
    }
    setModalOpen(false);
  };

  return (
    <>
      <div className={`${style.tableWrapper}`}>
        {!(orders?.length > 0) ? (
          <div className={style.warningTextWrapper}>
            {!orders && <BeatLoader color={'var(--green)'} loading={true} size={15} />}
            {orders?.length === 0 && <h2 className={style.warningText}>{t('empty')}</h2>}
          </div>
        ) : (
          <Table
            tableHead={ordersTableConfig}
            tableBody={orders}
            onActionClick={row => requestOrderCancellation(row)}
            rowsLimit={false}
            minWidth="1000px"
          />
        )}
      </div>

      <Modal active={cancelModalIsOpen} setActive={setModalOpen}>
        <CancelLeverageModal
          orderType={orderType}
          market={market}
          price={price}
          triggerPrice={triggerPrice}
          amount={amount}
          onCloseClick={cancelOrder}
          transactionType="order"
        />
      </Modal>
    </>
  );
};

export default React.memo(OrdersTable);
