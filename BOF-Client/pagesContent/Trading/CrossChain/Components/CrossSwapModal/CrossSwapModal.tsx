import React, { useCallback } from 'react';
import style from './ConfirmCrossSwap.module.css';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { ApproveSwapLimitModal } from 'pagesContent/Trading/Widget/SwapLimitApproveModal/SwapLimitApproveModal';
import { addCrossSwapApprove, removeCrossSwapApprove } from '@/redux/crossChainSlice';
import { SmartContracts } from '@bitoftrade/cross-chain-core';
import ConfirmCrossSwap from './ConfirmCrossSwap';

interface CrossSwapModalProps {
  approved: boolean;
  active: boolean;
  setActive: (a: boolean) => void;
  onConfirm: () => void;
}

const CrossSwapModal: React.FC<CrossSwapModalProps> = ({ approved, setActive }): JSX.Element => {
  const dispatch = useDispatch();
  const chainId = useAppSelector(({ app }) => app.chainId);
  const lastCrossChainParams = useAppSelector(({ crossChain }) => crossChain.lastParams);
  const slippage = useAppSelector(({ crossChain }) => crossChain.slippage);
  const nativeTokenUsdPrices = useAppSelector(({ crossChain }) => crossChain.nativeTokenUsdPrices);

  const removeApprove = (address: string) => dispatch(removeCrossSwapApprove({ chainId, address }));
  const addApprove = (address: string, txHash: string) =>
    dispatch(
      addCrossSwapApprove({
        chainId,
        address,
        txHash,
      })
    );

  const onConfirmCrossSwapSuccess = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <div className={style.wrapperModal}>
      {approved ? (
        <ConfirmCrossSwap
          crossChainParams={lastCrossChainParams}
          nativeTokenUsdPrices={nativeTokenUsdPrices}
          slippage={slippage}
          onSuccess={onConfirmCrossSwapSuccess}
        />
      ) : (
        <ApproveSwapLimitModal
          type="CrossSwap"
          approveForAddress={SmartContracts[chainId]?.crossChainRouter}
          setActive={setActive}
          removeApprove={removeApprove}
          addApprove={addApprove}
          amountInWei={lastCrossChainParams?.srcAmount}
        />
      )}
    </div>
  );
};

export default React.memo(CrossSwapModal);
