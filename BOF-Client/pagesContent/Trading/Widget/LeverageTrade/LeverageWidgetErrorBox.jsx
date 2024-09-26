import React from 'react';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { Alert } from '@/components/Alert/Alert';
import style from './LeverageTrade.module.css';

export const LeverageWidgetErrorBox = () => {
  const orderError = useAppSelector(({ leverage }) => leverage.orderError);

  if (orderError) {
    return (
      <div className={style.errorBoxWrapper}>
        <Alert severity="error">{orderError}</Alert>
      </div>
    );
  } else {
    return <></>;
  }
};

export default React.memo(LeverageWidgetErrorBox);
