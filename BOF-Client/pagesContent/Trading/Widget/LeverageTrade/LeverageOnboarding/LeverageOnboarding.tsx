import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import WidgetLoader from './WidgetLoader';
import { useDispatch } from 'react-redux';
import { setWithBalance } from '@/redux/dydxAuthSlice';
import LinkWallet from './LinkWallet';
import CreateUser from './CreateUser';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { NotAvailableForUsCitizens } from './NotAvailableForUsCitizens';
import { clientManager } from '@/common/DydxClientManager';
import Modal from '@/components/Modal/Modal';
import style from '../../../LeverageInfo/DepositWithdraw.module.css';
import { Chains } from 'connection/chainConfig';
import VirtualTradingAlertModal from '../LeverageModal/VirtualTradingAlertModal';

const LeverageOnboarding = () => {
  const dispatch = useDispatch();
  const { account: clientAddress, chainId, provider } = useWeb3React();
  const [isUsCitizen, setIsUsCitizen] = useState<boolean>(null);
  const authStep = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.authStep;
  });
  const withBalance = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.withBalance;
  });
  const [showVirtualTradingModal, setShowVirtualTradingModal] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get('https://ipapi.co/json/')
      .then((res: Record<string, any>) => {
        if (res.data.country === 'US') {
          setIsUsCitizen(true);
        } else {
          setIsUsCitizen(false);
        }
      })
      .catch(e => {
        console.error(e);
        setIsUsCitizen(false);
      });
  }, []);

  const checkIfUserExists = async (): Promise<boolean> => {
    try {
      clientManager.initDefaultClient(provider.provider, chainId);
      const res = await clientManager.client.public.doesUserExistWithAddress(clientAddress ?? '');
      return res.exists;
    } catch (e) {
      console.error('checkIfUserExists', e);
      return false;
    }
  };
  useEffect(() => {
    if (chainId === Chains.GOERLI) {
      setShowVirtualTradingModal(true);
    }
    checkIfUserExists().then(res => {
      dispatch(setWithBalance(res));
    });
  }, [clientAddress, chainId]);

  if (
    (withBalance === null && clientAddress?.length > 0) ||
    authStep > 4 ||
    (withBalance == true && authStep > 0) ||
    isUsCitizen === null
  ) {
    return <WidgetLoader />;
  }
  if (isUsCitizen) {
    return <NotAvailableForUsCitizens />;
  }
  if (authStep === 0) {
    return (
      <>
        <LinkWallet />
        <Modal active={showVirtualTradingModal} setActive={setShowVirtualTradingModal} className={style.modal}>
          <VirtualTradingAlertModal setActive={setShowVirtualTradingModal} />
        </Modal>
      </>
    );
  } else if (authStep <= 1) {
    return <CreateUser />;
  }
  return <></>;
};

export default LeverageOnboarding;
