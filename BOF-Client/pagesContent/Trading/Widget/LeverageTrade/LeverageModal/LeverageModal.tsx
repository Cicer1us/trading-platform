import React from 'react';
import style from './LeverageModal.module.css';
import Clarification from '@/components/Clarification/Clarification';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import useMultilingual from '@/hooks/useMultilingual';
import { OrderType } from '@dydxprotocol/v3-client';
import { getHumanReadableOderType } from '@/common/dydxHelpers';

interface LeverageModalProps {
  openPosition: () => void;
  isLoading: boolean;
  orderType: OrderType;
  market: string;
  amount: string;
  price: string;
  triggerPrice: string;
  liquidationPrice: string;
  fee: string;
  buttonTitle: string;
}

interface OrderSummaryData {
  title: string;
  clarification: string | null;
  value: string;
}

const LeverageModal: React.FC<LeverageModalProps> = ({
  openPosition,
  isLoading,
  orderType,
  market,
  price,
  amount,
  triggerPrice,
  liquidationPrice,
  fee,
  buttonTitle,
}: LeverageModalProps): JSX.Element => {
  const { t } = useMultilingual('leverageModal');
  const { c } = useMultilingual('leverageTransactionSummaryTooltip');

  const orderSummaryData: OrderSummaryData[] = [];
  const isMarketOrder = orderType === OrderType.MARKET;

  if (!isMarketOrder) {
    orderSummaryData.push({ title: t('type'), clarification: null, value: getHumanReadableOderType(orderType) });
    orderSummaryData.push({ title: t('pair'), clarification: null, value: market });
    orderSummaryData.push({ title: t('price'), clarification: null, value: price });
  }
  if (orderType === OrderType.STOP_LIMIT) {
    orderSummaryData.push({ title: t('triggerPrice'), clarification: null, value: triggerPrice });
  }

  if (isMarketOrder) {
    orderSummaryData.push({ title: t('liquidation'), clarification: c('liquidation'), value: liquidationPrice });
  } else {
    orderSummaryData.push({ title: t('amount'), clarification: null, value: amount });
  }
  orderSummaryData.push({ title: t('fee'), clarification: c('fees'), value: fee });

  return (
    <div className={style.wrapperModal}>
      <h3 className={style.titleModal}>
        {isMarketOrder ? t('summary') : t('orderSummary')} {market}
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

      <div className={style.sectionModal}>
        <h4 className={style.riskTitle}>{t('riskTitle')}</h4>
        <p className={style.riskDescription}>{t('riskDescription')}</p>
      </div>

      <div>
        <ButtonSimple disabled={isLoading} onClick={openPosition}>
          {buttonTitle}
        </ButtonSimple>
      </div>
    </div>
  );
};

export default LeverageModal;
