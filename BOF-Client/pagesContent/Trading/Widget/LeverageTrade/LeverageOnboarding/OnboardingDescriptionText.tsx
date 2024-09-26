import style from './LeverageOnboarding.module.css';
import React from 'react';
import useMultilingual from '@/hooks/useMultilingual';
import { useAppSelector } from '@/redux/hooks/reduxHooks';

const OnboardingDescriptionText = () => {
  const { t } = useMultilingual('widget');
  const currentStep = useAppSelector(({ dydxAuth }) => dydxAuth.authStep);

  if (currentStep === 0) {
    return (
      <>
        <h4 className={style.title}>{t('linkYourWallet')}</h4>
        <p className={style.description}>{t('linkYourWalletDescription')}</p>
      </>
    );
  } else if (currentStep === 1) {
    return (
      <>
        <h4 className={style.title}>{t('createAccount')}</h4>
        <p className={style.description}>{t('createAccountDescription')}</p>
      </>
    );
  } else if (currentStep === 2) {
    return (
      <>
        <h4 className={style.title}>{t('unlockUsdc')}</h4>
        <p className={style.description}>{t('unlockUsdcDescription')}</p>
      </>
    );
  } else if (currentStep === 3) {
    return (
      <>
        <h4 className={style.title}>{t('depositUsdc')}</h4>
        <p className={style.description}>{t('depositUsdcDescription')}</p>
      </>
    );
  } else if (currentStep === 4) {
    return (
      <>
        <h4 className={style.title}>{t('checkBalance')}</h4>
        <p className={style.description}>{t('checkBalanceDescription')}</p>
      </>
    );
  }
};

export default OnboardingDescriptionText;
