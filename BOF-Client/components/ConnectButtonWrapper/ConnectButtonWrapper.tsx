import React from 'react';
import useMultilingual from '@/hooks/useMultilingual';
import { useWeb3React } from '@web3-react/core';
import style from './ConnectButtonWrapper.module.css';
import useChainValidate from '@/hooks/useChainValidate';
import { ConnectWalletModal } from '../ConnectWallet/ConnectWalletModal';

export interface ConnectButtonWrapperProps {
  children?: React.ReactNode;
}

export default function ConnectButtonWrapper({ children }: ConnectButtonWrapperProps): JSX.Element {
  const { account } = useWeb3React();
  const [isOpen, setIsOpen] = React.useState(false);
  const { t } = useMultilingual('header');
  const { isWrongChain, isConnected } = useChainValidate();

  if (isWrongChain && isConnected && account) {
    return (
      <div className={style.wrapper}>
        <button type="button" className={`${style.button} ${style.error}`}>
          {t('wrongNetwork')}
        </button>
      </div>
    );
  }

  return (
    <>
      <ConnectWalletModal active={isOpen} setActive={setIsOpen} />
      {!account ? (
        <div className={style.wrapper}>
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
            }}
            className={`${style.button}`}
          >
            {t('connect')}
          </button>
        </div>
      ) : (
        children
      )}
    </>
  );
}
