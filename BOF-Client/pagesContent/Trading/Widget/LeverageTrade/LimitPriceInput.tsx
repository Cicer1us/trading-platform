import React from 'react';
import style from './LeverageTrade.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useDispatch } from 'react-redux';
import { InputWithCoinIcon } from '@/components/Inputs/InputWithCoinIcon';
import { setLimitPrice } from '@/redux/leverageSlice';
import LeverageWidgetClarification from './LeverageWidgetClarification';
import useMultilingual from '@/hooks/useMultilingual';
import { BASIC_LEVERAGE_TOKEN } from '@/common/LeverageTradeConstants';

const LimitPriceInput: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useMultilingual('widget');
  const { c } = useMultilingual('leverageWidgetTooltip');

  const limitPrice = useAppSelector(({ leverage }) => leverage?.limitPrice);

  return (
    <>
      <div className={style.cell}>
        <LeverageWidgetClarification label={t('limitPrice')} helperText={c('limitPrice')} />
      </div>
      <div className={style.amountInputWrapper}>
        <InputWithCoinIcon
          value={limitPrice}
          decimalScale={2}
          onChange={value => dispatch(setLimitPrice(Number(value)))}
          coinName={BASIC_LEVERAGE_TOKEN}
          placeholder="0"
          coinSymbol={BASIC_LEVERAGE_TOKEN}
        />
      </div>
    </>
  );
};

export default React.memo(LimitPriceInput);
