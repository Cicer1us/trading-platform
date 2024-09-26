import React from 'react';
import style from './LeverageOnboarding.module.css';
import useMultilingual from '@/hooks/useMultilingual';

export const NotAvailableForUsCitizens: React.FC = () => {
  const { t } = useMultilingual('widget');

  return (
    <>
      <h4 className={style.title}>{t('leverageTradingUnAvailable')}</h4>
      <span className={`${style.description} ${style.noMarginBottom}`}>{t('apologizeForInconvenience')}</span>
      <span className={`${style.description} ${style.noMarginBottom}`}>{t('unAvailableAvailableForUsCitizens')}</span>
      <p className={`${style.description} ${style.noMarginBottom}`}>{t('checkOutSwapAndLimit')}</p>
    </>
  );
};
