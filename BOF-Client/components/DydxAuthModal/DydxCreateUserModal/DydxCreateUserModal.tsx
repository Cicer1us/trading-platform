import React, { useState } from 'react';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import style from './DydxCreateUserModal.module.css';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { clientManager } from '@/common/DydxClientManager';
import { useWeb3React } from '@web3-react/core';
import { SigningMethod } from '@dydxprotocol/v3-client';
import { setUser, setAccount } from '@/redux/dydxDataSlice';
import { incrementStep, setAuthError, setAuthIsCompleted } from '@/redux/dydxAuthSlice';
import useMultilingual from '@/hooks/useMultilingual';
import { analytics, getLeverageAnalyticsData } from 'analytics/analytics';
import { Chains } from 'connection/chainConfig';

type DydxCreateUserModalProps = {
  setCreateUserModalIsActive: (modalStatus: boolean) => void;
};

const DydxCreateUserModal: React.FC<DydxCreateUserModalProps> = ({ setCreateUserModalIsActive }) => {
  const { t } = useMultilingual('dYdXModal');

  const positionToken = useAppSelector(({ leverage }) => leverage?.selectedMarket);
  const starKeys = useAppSelector(({ dydxAuth }) => dydxAuth.starkPrivateKey);

  const [sendRequestIsAvailable, setSendRequestIsAvailable] = useState<boolean>(true);

  const { account: clientAddress, chainId } = useWeb3React();
  const dispatch = useAppDispatch();

  const createDydxUser = async () => {
    const options = {
      propsType: 'leverage',
      type: 'Leverage',
      clientAddress,
      positionToken: positionToken,
      direction: '',
      chainId,
    };

    const analyticsData = getLeverageAnalyticsData(options);
    analytics('CE leverage_approve_account_receipt_confirm', null, null, analyticsData);

    try {
      setSendRequestIsAvailable(false);
      const params: {
        starkKey: string;
        starkKeyYCoordinate: string;
        referredByAffiliateLink?: string;
      } = {
        starkKey: starKeys.publicKey,
        starkKeyYCoordinate: starKeys.publicKeyYCoordinate,
      };

      chainId === Chains.MAINNET ? (params.referredByAffiliateLink = process.env.NEXT_PUBLIC_DYDX_AFFILIATE_LINK) : 0;

      const { user: dydxUser, account: dydxAccount } = await clientManager.client.onboarding.createUser(
        params,
        clientAddress,
        null,
        SigningMethod.MetaMask
      );

      dispatch(setUser(dydxUser));
      dispatch(setAccount(dydxAccount));
      dispatch(setAuthIsCompleted(true));
      dispatch(incrementStep());
      setCreateUserModalIsActive(false);
    } catch (error) {
      const res = { ...error };
      if (res?.data?.errors?.[0]?.msg) {
        dispatch(setAuthError(res?.data?.errors?.[0]?.msg));
      } else {
        console.error(error);
      }
      setCreateUserModalIsActive(false);
    } finally {
      analytics('CE leverage_approve_account_wallet_confirm', null, null, analyticsData);

      setSendRequestIsAvailable(true);
    }
  };

  return (
    <div className={style.wrapperModal}>
      <div className={style.titleWrapper}>
        <h3 className={style.titleModal}>{t('setupWallet')}</h3>
      </div>
      <p className={style.descriptionModal}>{t('createDescription')}</p>
      <ButtonSimple color="green" onClick={createDydxUser} disabled={!sendRequestIsAvailable}>
        {t('approve')}
      </ButtonSimple>
    </div>
  );
};

export default DydxCreateUserModal;
