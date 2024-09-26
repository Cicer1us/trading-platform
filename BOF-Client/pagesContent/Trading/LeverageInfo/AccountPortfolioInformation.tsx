import { BlockList, BlockItem } from '@/components/BlockList/BlockList';
import React, { useState } from 'react';
import useMultilingual from '@/hooks/useMultilingual';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { BASIC_LEVERAGE_TOKEN } from '@/common/LeverageTradeConstants';
import style from './DepositWithdraw.module.css';
import Modal from '@/components/Modal/Modal';
import { WithdrawModal } from './WithdrawModal';
import DepositOrApprove from './DepositOrApprove';

export const AccountPortfolioInformation = () => {
  const { t } = useMultilingual('widget');
  const [depositModalIsVisible, setDepositModalIsVisible] = useState<boolean>(false);
  const [withdrawModalIsVisible, setWithdrawModalIsVisible] = useState<boolean>(false);

  const equity = useAppSelector(({ dydxData }) => dydxData?.account?.equity);
  const accountLeverage = useAppSelector(({ dydxData }) => dydxData.accountLeverage);
  const marginUsage = useAppSelector(({ dydxData }) => dydxData.totalMarginUsage);
  const totalUnrealizedPL = useAppSelector(({ dydxData }) => {
    let total = 0;
    if (!dydxData?.account?.openPositions) {
      return totalUnrealizedPL;
    }
    for (const [, value] of Object.entries(dydxData.account.openPositions)) {
      total += Number(value.unrealizedPnl);
    }
    return total;
  });

  const pnlColor = () => {
    if (!totalUnrealizedPL) {
      return 'white';
    } else if (totalUnrealizedPL > 0) {
      return 'green';
    } else if (totalUnrealizedPL < 0) {
      return 'red';
    }
    return 'white';
  };

  return (
    <BlockList>
      <BlockItem
        title={t('balance')}
        content={equity ? Number(equity)?.toFixed(2) : '-'}
        suffix={` ${BASIC_LEVERAGE_TOKEN}`}
      />
      <BlockItem title={t('marginUsage')} content={marginUsage ? Number(marginUsage)?.toFixed(2) : '-'} suffix={'%'} />
      <BlockItem
        title={t('accountLeverage')}
        content={accountLeverage ? Number(accountLeverage)?.toFixed(2) : '-'}
        prefix={'x'}
      />
      <BlockItem
        title={t('unrealizedPl')}
        content={totalUnrealizedPL ? totalUnrealizedPL.toFixed(2) : '-'}
        contentState={pnlColor()}
      />
      <BlockItem title="Deposit" button onClick={() => setDepositModalIsVisible(true)} />
      <BlockItem title="Withdraw" button onClick={() => setWithdrawModalIsVisible(true)} />

      <Modal active={depositModalIsVisible} setActive={setDepositModalIsVisible} className={style.modal}>
        <DepositOrApprove setActive={setDepositModalIsVisible} />
      </Modal>

      <Modal active={withdrawModalIsVisible} setActive={setWithdrawModalIsVisible} className={style.modal}>
        <WithdrawModal setActive={setWithdrawModalIsVisible} />
      </Modal>
    </BlockList>
  );
};
