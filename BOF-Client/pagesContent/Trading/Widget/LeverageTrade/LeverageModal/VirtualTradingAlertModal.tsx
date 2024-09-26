import React from 'react';
import style from './LeverageModal.module.css';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import useMultilingual from '@/hooks/useMultilingual';
import { Alert } from '@/components/Alert/Alert';

interface VirtualTradingAlertModalProps {
  setActive: (a: boolean) => void;
}

const VirtualTradingAlertModal: React.FC<VirtualTradingAlertModalProps> = ({
  setActive,
}: VirtualTradingAlertModalProps): JSX.Element => {
  const { t } = useMultilingual('leverageModal');

  return (
    <div className={style.wrapperModal}>
      <h3 className={style.titleModal}>{t('testnet')}</h3>
      <Alert severity={'info'}>
        <p>{t('virtualTradingDescription')}</p>
      </Alert>
      <div className={style.actions}>
        <ButtonSimple onClick={() => setActive(false)}>{t('awesome')}</ButtonSimple>
      </div>
    </div>
  );
};

export default VirtualTradingAlertModal;
