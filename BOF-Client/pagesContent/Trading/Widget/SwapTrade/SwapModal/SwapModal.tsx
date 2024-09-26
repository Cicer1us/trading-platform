import React from 'react';
import style from './SwapModal.module.css';
import { ConfirmSwapModal } from './ConfirmSwapModal';
import { ApproveSwapLimitModal } from '../../SwapLimitApproveModal/SwapLimitApproveModal';
import { addSwapApprove, removeSwapApprove } from '@/redux/swapSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { Exchanges, PROXY_APPROVE_ADDRESSES } from '@/common/constants';

interface SwapModalProps {
  approved: boolean;
  active: boolean;
  setActive: (a: boolean) => void;
  onConfirm: () => void;
}

const SwapModal: React.FC<SwapModalProps> = ({
  approved,
  setActive,
  active,
  onConfirm,
}: SwapModalProps): JSX.Element => {
  const dispatch = useDispatch();
  const chainId = useAppSelector(({ app }) => app.chainId);
  const priceRoute = useAppSelector(({ swap }) => swap.priceRoute);

  const removeApprove = (address: string) => dispatch(removeSwapApprove({ chainId, address }));
  const addApprove = (address: string, txHash: string) =>
    dispatch(
      addSwapApprove({
        chainId,
        address,
        txHash,
      })
    );

  return (
    <div className={style.wrapperModal}>
      {approved ? (
        <ConfirmSwapModal setActive={setActive} active={active} onConfirm={onConfirm} />
      ) : (
        <ApproveSwapLimitModal
          type="Swap"
          approveForAddress={PROXY_APPROVE_ADDRESSES[Exchanges.PARASWAP]}
          setActive={setActive}
          removeApprove={removeApprove}
          addApprove={addApprove}
          amountInWei={priceRoute?.srcAmount}
        />
      )}
    </div>
  );
};

export default React.memo(SwapModal);
