import useMultilingual from '@/hooks/useMultilingual';
import React from 'react';
import ConnectButtonWrapper from '@/components/ConnectButtonWrapper/ConnectButtonWrapper';
import style from './Widget.module.css';

const ConnectWallet = () => {
  const { t } = useMultilingual('widget');

  return (
    <div className={style.connectWrapper}>
      <div className={style.connectMetamaskTextWrapper}>
        <div className={style.connectDescription}>{t('connectWalletDescription')}</div>
        <h6 className={style.connectTitle}>{t('connect')}</h6>
      </div>

      <div className={style.grow} />
      <div className={style.connectButtonWrapper}>
        <ConnectButtonWrapper />
      </div>
    </div>
  );
};

export default ConnectWallet;
