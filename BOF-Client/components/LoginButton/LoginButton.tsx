import React, { useState, useCallback } from 'react';
import style from './LoginButton.module.css';
import CutCenter from '@/helpers/CutCenter';
import { CopyIconSecondary } from '@/assets/icons/InputIcons';
import { useAppDispatch } from '@/redux/hooks/reduxHooks';
import { resetBalances, setClientAddress, updateSelectedWallet } from '@/redux/appSlice';
import LogoutIcon from '@/assets/icons/LogoutIcon';
import useMultilingual from '@/hooks/useMultilingual';
import { setDydxAuthToInitial } from '@/redux/dydxAuthSlice';
import { setDydxDataToInitial } from '@/redux/dydxDataSlice';
import { setLeverageOrderError } from '@/redux/leverageSlice';
import { useWeb3React } from '@web3-react/core';
import ConnectButtonWrapper from '@/components/ConnectButtonWrapper/ConnectButtonWrapper';
import { batch } from 'react-redux';

const LoginButton: React.FC = () => {
  const { t } = useMultilingual('header');
  const { account, connector } = useWeb3React();
  const [showCopiedAlert, setShowCopiedAlert] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onLogoutClick = useCallback(() => {
    if (connector && connector.deactivate) {
      connector.deactivate();
    }
    connector.resetState();
    batch(() => {
      dispatch(updateSelectedWallet({ wallet: undefined }));
      dispatch(setDydxAuthToInitial());
      dispatch(setDydxDataToInitial());
      dispatch(setLeverageOrderError(null));
      dispatch(setClientAddress(''));
      dispatch(resetBalances());
    });
  }, [connector, dispatch]);

  // const onLogoutClick = () => {
  //   // @ts-ignore
  //   if (connector?.close) connector?.close();
  //   else if (deactivate) deactivate();
  //   batch(() => {
  //     dispatch(setDydxAuthToInitial());
  //     dispatch(setDydxDataToInitial());
  //     dispatch(setLeverageOrderError(null));
  //     dispatch(setClientAddress(''));
  //     dispatch(resetBalances());
  //   });
  // };

  const copy = () => {
    navigator.clipboard.writeText(account);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 1000);
  };

  return (
    <>
      <ConnectButtonWrapper>
        <div className={style.wrapper}>
          <button type="button" onClick={copy} className={`${style.button} ${style.connect} ${style.darkBlack}`}>
            {showCopiedAlert ? (
              t('copied')
            ) : (
              <>
                {CutCenter(account, 6)} <CopyIconSecondary />
              </>
            )}
          </button>
        </div>
      </ConnectButtonWrapper>
      {account && (
        <div className={`${style.logout} ${style.connect} ${style.darkBlack}`} onClick={onLogoutClick}>
          <LogoutIcon />
        </div>
      )}
    </>
  );
};

export default LoginButton;
