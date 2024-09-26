import useMultilingual from '@/hooks/useMultilingual';
import React from 'react';
import style from './Widget.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { chains } from 'connection/chainConfig';
import { useWeb3React } from '@web3-react/core';
import useChainValidate from '@/hooks/useChainValidate';
import { switchChain } from 'connection/switchChain';
import { availableChains } from '@/common/constants';

const ChangeChain = () => {
  const { t, tc } = useMultilingual('widget');

  const { isAvailableForCurrentService } = useChainValidate();
  const { chainId: metamaskChainId, connector } = useWeb3React();
  const tab = useAppSelector(({ widget }) => widget.tab);
  const chainId = useAppSelector(({ app }) => (isAvailableForCurrentService ? app.chainId : availableChains[tab][0]));

  const switchOnClick = async () => {
    try {
      await switchChain(connector, Number(chainId));
    } catch (error) {
      console.error(error.message);
    }
  };

  const getChainName = chainId => {
    const name = chains[chainId]?.name;
    return name ?? 'unsupported chain';
  };

  return (
    <div className={style.connectWrapper}>
      <div className={style.connectMetamaskTextWrapper}>
        <h6 className={style.connectTitle}>{t('wrongChainTitle')}</h6>
        <div className={style.connectDescription}>
          {isAvailableForCurrentService
            ? `${tc('wrongChainMessage')([getChainName(metamaskChainId)])} `
            : `${tc('availableChainsMessage')([getChainName(chainId)])} `}
          <span className={`${style.switchNetworkButton} ${style.action}`} onClick={switchOnClick}>
            {tc('switchTo')([chains[chainId]?.name])}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChangeChain;
