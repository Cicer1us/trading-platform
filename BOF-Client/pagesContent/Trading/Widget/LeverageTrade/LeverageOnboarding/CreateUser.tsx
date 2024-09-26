import useMultilingual from '@/hooks/useMultilingual';
import React, { useState } from 'react';
import style from './LeverageOnboarding.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import Modal from '@/components/Modal/Modal';
import DydxCreateUserModal from '@/components/DydxAuthModal/DydxCreateUserModal/DydxCreateUserModal';
import { StepStatus } from '@/redux/dydxAuthSlice';
import WidgetSendButton from '../../WidgetSendButton/WidgetSendButton';
import OnboardingDescriptionText from './OnboardingDescriptionText';
import { Alert } from '@/components/Alert/Alert';

const CreateUser = () => {
  const { t } = useMultilingual('widget');
  const isAuthorized = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.authIsCompleted;
  });
  const secondStepStatus: StepStatus = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.apiKeyCredentialsStatus;
  });
  const authError: string | null = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.authError;
  });

  const [createUserModalIsActive, setCreateUserModalIsActive] = useState<boolean>(false);

  return (
    <>
      <div className={style.container}>
        <div className={style.content}>
          <OnboardingDescriptionText />
          {authError && <Alert severity="error"> {authError}</Alert>}
          <div className={style.inputContainer} />
        </div>

        <WidgetSendButton disabled={false} onClick={() => setCreateUserModalIsActive(true)} title={t('setupWallet')} />
      </div>

      <Modal
        active={createUserModalIsActive && secondStepStatus === 'done' && !isAuthorized}
        setActive={setCreateUserModalIsActive}
      >
        <DydxCreateUserModal setCreateUserModalIsActive={setCreateUserModalIsActive} />
      </Modal>
    </>
  );
};

export default CreateUser;
