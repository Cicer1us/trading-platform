import Clarification from '@/components/Clarification/Clarification';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import useMultilingual from '@/hooks/useMultilingual';
import React from 'react';
import style from './LeverageTransactionModal.module.css';
import { getHumanReadableOderType } from '@/common/dydxHelpers';
import { OrderType } from '@dydxprotocol/v3-client';

interface CancelLeverageModelProps {
  onCloseClick: () => void;
  transactionType: 'order' | 'position';
  fee?: number;
  pl?: number;
  orderType?: string;
  market?: string;
  price?: string;
  triggerPrice?: string;
  amount?: string;
}

interface OrderSummaryData {
  title: string;
  clarification: string | null;
  value: string;
}

const CancelLeverageModal: React.FC<CancelLeverageModelProps> = ({
  onCloseClick,
  transactionType,
  fee,
  pl,
  orderType,
  market,
  price,
  triggerPrice,
  amount,
}) => {
  const { t } = useMultilingual('leverageModal');
  const { c } = useMultilingual('leverageTransactionSummaryTooltip');

  const orderSummaryData: OrderSummaryData[] = [];

  if (transactionType === 'position') {
    orderSummaryData.push({ title: t('fee'), clarification: c('fees'), value: fee.toFixed(2) });
    orderSummaryData.push({ title: t('profitLoss'), clarification: c('profitLoss'), value: `${pl} $` });
  } else if (transactionType === 'order') {
    orderSummaryData.push({ title: t('type'), clarification: null, value: orderType });
    orderSummaryData.push({ title: t('pair'), clarification: null, value: market });
    orderSummaryData.push({ title: t('price'), clarification: null, value: `$${price}` });

    if (orderType === getHumanReadableOderType(OrderType.STOP_LIMIT)) {
      orderSummaryData.push({ title: t('triggerPrice'), clarification: null, value: `$${triggerPrice}` });
    }
    orderSummaryData.push({ title: t('amount'), clarification: null, value: amount });
  }

  return (
    <div className={style.wrapperModal}>
      <h3 className={style.titleModal}>
        {transactionType === 'position' ? t('positionClosing') : t('orderCancellation')}
      </h3>
      <p className={style.descriptionModal}>{t('detail')}:</p>
      <div className={style.sectionModal}>
        <ul className={style.listModal}>
          {orderSummaryData.map(data => (
            <li className={style.listItemModal}>
              <div className={style.itemNameModal}>
                <span className={style.nameModal}>{data.title}</span>
                {data.clarification && <Clarification helperText={data.clarification} />}
              </div>
              <span className={style.itemValueModal}>{data.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={style.actions}>
        <ButtonSimple onClick={onCloseClick}>
          {transactionType === 'position' ? t('closePosition') : t('cancelOrder')}
        </ButtonSimple>
      </div>
    </div>
  );
};

export default CancelLeverageModal;
