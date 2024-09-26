import useMultilingual from '@/hooks/useMultilingual';
import React, { useState } from 'react';
import style from './LeverageOnboarding.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import Modal from '@/components/Modal/Modal';
import DydxAuthModal from '@/components/DydxAuthModal/DydxAuthModal';
import { StepStatus } from '@/redux/dydxAuthSlice';
import WidgetSendButton from '../../WidgetSendButton/WidgetSendButton';
import OnboardingDescriptionText from './OnboardingDescriptionText';
import { Chains } from 'connection/chainConfig';
import { Alert } from '@/components/Alert/Alert';

const LeverageOnboarding = () => {
  const { t } = useMultilingual('widget');
  const chainId = useAppSelector(({ app }) => app.chainId);
  const isAuthorized = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.authIsCompleted;
  });
  const secondStepStatus: StepStatus = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.apiKeyCredentialsStatus;
  });
  const authError: string | null = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.authError;
  });

  const [authModalIsActive, setAuthModalIsActive] = useState<boolean>(false);

  return (
    <>
      <div className={style.container}>
        <div className={style.content}>
          <OnboardingDescriptionText />
          {authError && <Alert severity="error"> {authError}</Alert>}
          <div className={style.inputContainer} />
        </div>

        <WidgetSendButton
          disabled={chainId !== Chains.MAINNET && chainId !== Chains.GOERLI}
          onClick={() => setAuthModalIsActive(true)}
          title={t('linkWallet')}
        />
      </div>

      <Modal
        active={authModalIsActive && secondStepStatus !== 'done' && !isAuthorized}
        setActive={setAuthModalIsActive}
      >
        <DydxAuthModal setAuthModalIsActive={setAuthModalIsActive} />
      </Modal>
    </>
  );
};

export default LeverageOnboarding;
