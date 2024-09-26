import React from 'react';
import style from './ApproveModal.module.css';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import useMultilingual from '@/hooks/useMultilingual';

interface ApproveModalProps {
  permanentlyApprove: () => Promise<void>;
  tokenIcon: JSX.Element;
  tokenSymbol: string;
  isLoading: boolean;
}

const ApproveModal: React.FC<ApproveModalProps> = ({
  tokenIcon,
  tokenSymbol,
  permanentlyApprove,
  isLoading,
}): JSX.Element => {
  const { t, tc } = useMultilingual('unlockModal');
  return (
    <div className={style.wrapperModal}>
      {tokenIcon}
      <h5 className={style.titleModal}>{tc('unlockTitle')([tokenSymbol])}</h5>
      <p className={style.descriptionModal}>{tc('unlockDescription')(['', tokenSymbol])}</p>
      <div className={style.actionsModal}>
        <ButtonSimple color={'white'} onClick={permanentlyApprove} isLoading={isLoading}>
          {t('permanentUnlock')}
        </ButtonSimple>
      </div>
    </div>
  );
};

export default React.memo(ApproveModal);
