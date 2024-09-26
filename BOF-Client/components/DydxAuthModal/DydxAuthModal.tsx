import CheckMarkIcon from '@/assets/icons/CheckIcon';
import LoadingStepIcon from '@/assets/icons/LoadingStepIcon';
import LogoMetaMask from '@/assets/icons/LogoMetaMask';
import React, { useState } from 'react';
import { ButtonSimple } from '../Buttons/Buttons';
import style from './DydxAuthModal.module.css';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { clientManager } from '@/common/DydxClientManager';
import { useWeb3React } from '@web3-react/core';
import { SigningMethod } from '@dydxprotocol/v3-client';
import {
  setApiKeyCredentials,
  setStarkPrivateKeys,
  setAuthIsCompleted,
  StepStatus,
  incrementStep,
} from '@/redux/dydxAuthSlice';
import { KeyPairWithYCoordinate } from '@dydxprotocol/starkex-lib';
import { analytics, getLeverageAnalyticsData } from 'analytics/analytics';
import { setDydxAuthStatus, setUser } from '@/redux/dydxDataSlice';
import useMultilingual from '@/hooks/useMultilingual';
import { getIsMetaMaskWallet } from 'connection/utils';

type DydxAuthModalProps = {
  setAuthModalIsActive: (status: boolean) => void;
};

const DydxAuthModal: React.FC<DydxAuthModalProps> = ({ setAuthModalIsActive }) => {
  const { t } = useMultilingual('dYdXModal');
  const [signRequestFailed, setSignRequestFailed] = useState<boolean>(false);

  const firstStepStatus: StepStatus = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.starkPrivateKeyStatus;
  });
  const secondStepStatus: StepStatus = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.apiKeyCredentialsStatus;
  });

  const connectedUsingMetamask = getIsMetaMaskWallet();
  const { account: clientAddress, connector, chainId } = useWeb3React();
  const dispatch = useAppDispatch();

  const getAnalyticProps = () => {
    return {
      propsType: 'leverage',
      type: 'Leverage',
      clientAddress,
      positionToken: '',
      direction: '',
      chainId,
    };
  };

  const firstStepActions = async provider => {
    if (firstStepStatus === null) {
      const analyticsData = getLeverageAnalyticsData(getAnalyticProps());
      analytics('CE leverage_approve_ownership_receipt_confirm', null, null, analyticsData);

      try {
        dispatch(setStarkPrivateKeys({ starkPrivateKey: null, starkPrivateKeyStatus: 'loading' }));
        const keyPairWithYCoordinate: KeyPairWithYCoordinate = await clientManager.client.onboarding.deriveStarkKey(
          clientAddress,
          SigningMethod.MetaMask
        );
        dispatch(setStarkPrivateKeys({ starkPrivateKey: keyPairWithYCoordinate, starkPrivateKeyStatus: 'done' }));
        clientManager.provideStarkPrivateKey(keyPairWithYCoordinate.privateKey, provider, chainId);
        setSignRequestFailed(false);

        const analyticsData = getLeverageAnalyticsData(getAnalyticProps());
        analytics('CE leverage_approve_ownership_wallet_confirm', null, null, analyticsData);
      } catch (e) {
        dispatch(setStarkPrivateKeys({ starkPrivateKey: null, starkPrivateKeyStatus: null }));
        setSignRequestFailed(true);
        throw e;
      }
    }
  };

  const secondStepActions = async provider => {
    dispatch(setDydxAuthStatus('loading'));
    const analyticsData = getLeverageAnalyticsData(getAnalyticProps());
    analytics('CE leverage_approve_trading_receipt_confirm', null, null, analyticsData);

    try {
      dispatch(setApiKeyCredentials({ apiKeyCredentials: null, apiKeyCredentialsStatus: 'loading' }));
      const apiKeyCredentials = await clientManager.client.onboarding.recoverDefaultApiCredentials(
        clientAddress,
        SigningMethod.MetaMask
      );
      clientManager.provideApiKeyCredentials(apiKeyCredentials, provider, chainId);

      dispatch(setApiKeyCredentials({ apiKeyCredentials: apiKeyCredentials, apiKeyCredentialsStatus: 'done' }));
      dispatch(incrementStep());
      setSignRequestFailed(false);

      const analyticsData = getLeverageAnalyticsData(getAnalyticProps());
      analytics('CE leverage_approve_trading_wallet_confirm', null, null, analyticsData);

      const { user: dydxUser } = await clientManager.client.private.getUser();
      dispatch(setUser(dydxUser));
      dispatch(incrementStep());
      setTimeout(() => dispatch(setAuthIsCompleted(true)), 300);
      setAuthModalIsActive(false);
    } catch (e) {
      if (e.status === 400) {
        setAuthModalIsActive(false);
        return;
      }
      dispatch(setApiKeyCredentials({ apiKeyCredentials: null, apiKeyCredentialsStatus: null }));
      setSignRequestFailed(true);
      dispatch(setDydxAuthStatus(null));
      throw e;
    }
  };

  const manageAuth = async () => {
    const provider = connector.provider;

    if (connectedUsingMetamask) {
      try {
        await firstStepActions(provider);
        await secondStepActions(provider);
      } catch (e) {
        console.error(e);
      }
    } else {
      firstStepStatus === null ? await firstStepActions(provider) : await secondStepActions(provider);
    }
  };

  return (
    <div className={style.wrapperModal}>
      <div className={style.titleWrapper}>
        <h3 className={style.titleModal}>{t('title')}</h3>
        <LogoMetaMask size={32} />
      </div>
      <p className={style.descriptionModal}>{t('description')}</p>
      <div className={`${style.signWrapper} ${firstStepStatus !== 'done' ? style.active : ''}`}>
        <div>
          <h4 className={style.signTitle}>{t('firstStepTitle')}</h4>
          <p className={style.signDescription}>{t('firstStepDescription')}</p>
        </div>
        {firstStepStatus === null && (
          <div className={style.stepWrapper}>
            <p className={style.stepTitle}>1</p>
          </div>
        )}
        {firstStepStatus === 'loading' && (
          <div className={`${style.stepWrapper}`}>
            <LoadingStepIcon />
          </div>
        )}
        {firstStepStatus === 'done' && (
          <div className={style.approveStepWrapper}>
            <CheckMarkIcon color="white" />
          </div>
        )}
      </div>
      <div className={`${style.signWrapper} ${firstStepStatus === 'done' ? style.active : ''}`}>
        <div>
          <h4 className={style.signTitle}>{t('secondStepTitle')}</h4>
          <p className={style.signDescription}>{t('secondStepDescription')}</p>
        </div>
        {secondStepStatus === null && (
          <div className={style.stepWrapper}>
            <p className={style.stepTitle}>2</p>
          </div>
        )}
        {secondStepStatus === 'loading' && (
          <div className={`${style.stepWrapper}`}>
            <LoadingStepIcon />
          </div>
        )}
        {secondStepStatus === 'done' && (
          <div className={style.approveStepWrapper}>
            <CheckMarkIcon color="white" />
          </div>
        )}
      </div>
      <ButtonSimple
        color="green"
        onClick={manageAuth}
        disabled={firstStepStatus === 'loading' || secondStepStatus === 'loading'}
      >
        {signRequestFailed ? t('tryAgain') : t('send')}
      </ButtonSimple>
    </div>
  );
};

export default DydxAuthModal;
