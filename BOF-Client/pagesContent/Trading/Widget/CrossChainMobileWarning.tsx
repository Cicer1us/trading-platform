import useMultilingual from '@/hooks/useMultilingual';
import React from 'react';
import style from './Widget.module.css';

const CrossChainMobileWarning = () => {
  const { t } = useMultilingual('widget');

  return (
    <div className={style.connectWrapper}>
      <div className={style.connectMetamaskTextWrapper}>
        <h6 className={style.connectTitle}>{t('crossChainMobileWarningTitle')}</h6>
        <div className={style.connectDescription}>{t('crossChainMobileWarningDescription')}</div>
      </div>
    </div>
  );
};

export default CrossChainMobileWarning;
