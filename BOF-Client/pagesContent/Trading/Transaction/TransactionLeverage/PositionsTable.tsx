import React, { useState } from 'react';
import Table from '@/components/Table/Table';
import style from './TransactionLeverage.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import useMultilingual from '@/hooks/useMultilingual';
import Modal from '@/components/Modal/Modal';
import { Market as DydxMarket, OrderSide, OrderType, TimeInForce } from '@dydxprotocol/v3-client';
import dayjs from 'dayjs';
import { clientManager } from '@/common/DydxClientManager';
import { LEVERAGE_ORDER_FEE, LIMIT_FEE } from '@/common/LeverageTradeConstants';
import { formatSize } from '@/common/leverageCalculations';
import BeatLoader from 'react-spinners/BeatLoader';
import { openedPositionsTableConfig } from './openedPositionsTable.config';
import { createMarketPositionsArray } from './createMarketPositionsArray';
import CancelLeverageModal from './ModalWindows/CancelLeverageModal';
import PositionAutoClose from './ModalWindows/PositionAutoClose/PositionAutoClose';
import OpenPositionDropDown from './OpenPositionDropdown';

const PositionsTable = () => {
  const { t } = useMultilingual('transaction');
  const [cancelModalIsOpen, setModalOpen] = useState<boolean>(false);
  const [positionAutoCloseModalIsOpen, setPositionAutoCloseModalIsOpen] = useState<boolean>(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [fee, setFee] = useState<number>(0);
  const [pl, setPl] = useState<number>(0);

  const account = useAppSelector(({ dydxData }) => dydxData.account);
  const markets = useAppSelector(({ dydxData }) => dydxData.markets);
  const transactionMargin = useAppSelector(({ dydxData }) => {
    return createMarketPositionsArray(dydxData);
  });

  const requestOrderCancellation = async row => {
    const fee =
      Number(markets[row.market].oraclePrice) *
      Number(row.position.substring(0, row.position.indexOf(' '))) *
      Number(LEVERAGE_ORDER_FEE);
    setFee(fee);
    setPl(row.pl);
    setModalOpen(true);
    setOrderToCancel(row);
  };

  const cancelOrder = async () => {
    const side = orderToCancel.side === 'SHORT' ? OrderSide.BUY : OrderSide.SELL;
    const formattedPrice = formatSize(
      Number(markets[orderToCancel.market].oraclePrice),
      markets[orderToCancel.market].tickSize,
      side === OrderSide.BUY ? 0.05 : -0.05
    );

    try {
      const size = orderToCancel.position.substring(0, orderToCancel.position.indexOf(' '));
      const tradeObj = {
        market: orderToCancel.market as DydxMarket,
        side: side,
        type: OrderType.MARKET,
        timeInForce: TimeInForce.FOK,
        postOnly: false,
        size: size,
        price: formattedPrice.toString(),
        // TODO: Talk about this value and make decision about its default size
        limitFee: LIMIT_FEE,
        expiration: dayjs().add(5, 'minute').toISOString(),
      };
      await clientManager.client.private.createOrder(tradeObj, account.positionId);
    } catch (e) {
      console.error(e);
    }
    setModalOpen(false);
  };

  const setPositionAutoClose = async row => {
    setPositionAutoCloseModalIsOpen(true);
    setOrderToCancel(row);
  };

  return (
    <>
      <div className={`${style.tableWrapper}`}>
        {!(transactionMargin?.length > 0) ? (
          <div className={style.warningTextWrapper}>
            {!transactionMargin && <BeatLoader color={'#38d9c0'} loading={true} size={15} />}
            {transactionMargin?.length === 0 && <h2 className={style.warningText}>{t('empty')}</h2>}
          </div>
        ) : (
          <Table
            tableHead={openedPositionsTableConfig}
            tableBody={transactionMargin}
            SubInfoComponent={OpenPositionDropDown}
            onActionClick={row => requestOrderCancellation(row)}
            onSetItClick={row => setPositionAutoClose(row)}
            rowsLimit={false}
            minWidth="1000px"
            withSubInfo={true}
          />
        )}
      </div>

      <Modal active={cancelModalIsOpen} setActive={setModalOpen}>
        <CancelLeverageModal onCloseClick={cancelOrder} fee={fee} pl={pl} transactionType="position" />
      </Modal>

      <Modal active={positionAutoCloseModalIsOpen} setActive={setPositionAutoCloseModalIsOpen}>
        <PositionAutoClose order={orderToCancel} setModalActive={setPositionAutoCloseModalIsOpen} />
      </Modal>
    </>
  );
};

export default React.memo(PositionsTable);
