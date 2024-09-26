import React from 'react';
import style from './LimitModal.module.css';
import { ApproveSwapLimitModal } from '../../SwapLimitApproveModal/SwapLimitApproveModal';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { addLimitApprove, removeLimitApprove } from '@/redux/limitSlice';
import { ConfirmLimitModal } from './ConfirmLimitModal';
import { convertToWei } from '@/helpers/convertFromToWei';
import { getContractAddressesForChainOrThrow, ChainId } from '@0x/contract-addresses';
import { Chains } from 'connection/chainConfig';

interface LimitModalProps {
  approved: boolean;
  active: boolean;
  setActive: (a: boolean) => void;
  valueFirst: number;
  valueSecond: number;
  valuePeriod: number;
  chainId: Chains;
  onConfirm: () => void;
}

const LimitModal: React.FC<LimitModalProps> = ({
  approved,
  setActive,
  active,
  valueFirst,
  valueSecond,
  valuePeriod,
  chainId,
  onConfirm,
}: LimitModalProps): JSX.Element => {
  const dispatch = useDispatch();
  const tokenA = useAppSelector(({ widget }) => widget.selectedTokenA);
  const amountInWei = convertToWei(valueFirst, tokenA.decimals);
  const approveForAddress = getContractAddressesForChainOrThrow(Number(chainId) as ChainId).exchangeProxy;

  const removeApprove = (address: string) => dispatch(removeLimitApprove({ chainId, address }));
  const addApprove = (address: string, txHash: string) =>
    dispatch(
      addLimitApprove({
        chainId,
        address,
        txHash,
      })
    );

  return (
    <div className={style.wrapperModal}>
      {approved ? (
        <ConfirmLimitModal
          onConfirm={onConfirm}
          setActive={setActive}
          active={active}
          valueFirst={valueFirst}
          valuePeriod={valuePeriod}
          valueSecond={valueSecond}
        />
      ) : (
        <ApproveSwapLimitModal
          type="Limit"
          approveForAddress={approveForAddress}
          setActive={setActive}
          removeApprove={removeApprove}
          addApprove={addApprove}
          amountInWei={amountInWei}
        />
      )}
    </div>
  );
};

export default React.memo(LimitModal);
