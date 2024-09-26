import React from 'react';
import style from './ApproveModal.module.css';
import { ButtonLink } from '@/components/Buttons/Buttons';
import useMultilingual from '@/hooks/useMultilingual';
import { chains, Chains } from 'connection/chainConfig';
import CoinsImages from '@/components/CoinsImages/CoinsImages';

interface PendingApproveModalProps {
  symbol: string;
  txHash: string;
  chainId: Chains;
}

const PendingApproveModal: React.FC<PendingApproveModalProps> = ({ symbol, chainId, txHash }): JSX.Element => {
  const { tc } = useMultilingual('pendingModal');
  const link = `${chains[chainId].explorerUrl}/tx/${txHash}`;

  return (
    <div className={style.wrapperModal}>
      <CoinsImages symbol={symbol} />
      <h5 className={style.titleModal}>{tc('pendingTitle')([symbol])}</h5>
      <p className={style.descriptionModal}>{tc('pendingDescription')([symbol])}</p>
      <div className={style.actionsModal}>
        <ButtonLink color="green" href={link}>
          {tc('checkOnExplorer')}
        </ButtonLink>
      </div>
    </div>
  );
};

export default React.memo(PendingApproveModal);
