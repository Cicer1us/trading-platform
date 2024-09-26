import React from 'react';
import style from './LeverageTrade.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useDispatch } from 'react-redux';
import useMultilingual from '@/hooks/useMultilingual';
import { setIsBuy } from '@/redux/widgetSlice';

const BuySellButtonsBlock: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useMultilingual('widget');

  const isBuy = useAppSelector(({ widget }) => widget.isBuy);

  const onBuyClick = () => {
    if (isBuy) return;
    dispatch(setIsBuy(true));
  };
  const onSellClick = () => {
    if (!isBuy) return;
    dispatch(setIsBuy(false));
  };

  return (
    <div className={style.buySellWrapper}>
      <div className={`${style.buySellTitle} ${style.red} ${!isBuy ? style.active : ''}`} onClick={onSellClick}>
        {t('sell')}
      </div>
      <div className={`${style.buySellTitle} ${isBuy ? style.active : ''}`} onClick={onBuyClick}>
        {t('buy')}
      </div>
    </div>
  );
};

export default React.memo(BuySellButtonsBlock);
