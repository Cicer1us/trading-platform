import { Box, CircularProgress, Typography, styled, Skeleton } from '@mui/material';
import { OrderPrice } from '../OrderPrice';
import { SelectChain } from '../SelectChain';
import { SelectTokenButton } from '../SelectTokenButton';
import { TransactionDetails } from '../TransactionDetails';
import { DefaultButton } from 'src/@core/components/buttons/DefaultButton';
import { useCompleteOrder } from 'src/hooks/useCompleteOrder';
import { useWeb3React } from '@web3-react/core';
import { useModalState } from 'src/store/modal/hooks/useModalState';
import { ModalType } from 'src/store/modal/types';
import { getEllipsisString } from 'src/@core/utils/getEllipsisString';
import { WalletMenu } from '../walletMenu/WalletMenu';
import { PaymentDefaultScreenSkeleton } from '../DefaultScreenSkeleton';
import { usePayment } from 'src/hooks/usePayment';
import { useAppDispatch, useAppSelector } from 'src/store/hooks/reduxHooks';
import { PaymentScreen, setPaymentScreen, setSelectedChainId } from 'src/store/payment/slice';
import { switchChain } from 'src/connection/switchChain';
import toast from 'react-hot-toast';
import { usePaymentCondition } from 'src/hooks/usePaymentCondition';

const StyledLoader = styled(CircularProgress, {
  name: 'StyledLoader'
})(({ theme }) => ({
  color: theme.palette.success.main
}));

export const DefaultScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedChainId } = useAppSelector(({ payment }) => payment);
  const { account, isActivating, connector } = useWeb3React();
  const { openModal } = useModalState();

  const { data: order, isLoading: orderIsLoading } = usePayment();
  const { mutate: completeOrderMutate } = useCompleteOrder();
  const {
    isWrongChain,
    isInsufficientAllowance,
    isInsufficientBalance,
    isLoading: conditionsIsLoading
  } = usePaymentCondition();

  /**
   * @note there is a lot of conditions to check
   * @todo refactor this with status enum to handle all cases
   * ex. (PAYMENT_STATUS.noAccount, PAYMENT_STATUS.wrongChain, PAYMENT_STATUS.insufficientBalance, PAYMENT_STATUS.insufficientAllowance, etc.)
   */

  const onClick = async () => {
    if (!account) {
      openModal({ modalType: ModalType.PAYMENT_CONNECT_WALLET });

      return;
    }

    if (isWrongChain) {
      try {
        dispatch(setSelectedChainId(selectedChainId));
        await switchChain(connector, selectedChainId);
      } catch (error) {
        console.error(error);
        toast.error('Failed to switch chain');
      }

      return;
    }

    if (isInsufficientBalance) return;

    if (isInsufficientAllowance) {
      dispatch(setPaymentScreen(PaymentScreen.UNLOCK));

      return;
    }

    // if everything is ok - complete order
    completeOrderMutate();
  };

  const getButtonLabel = (): string => {
    if (!account) return 'Connect Wallet';
    if (isWrongChain) return 'Switch chain';
    if (isInsufficientBalance) return 'Insufficient balance';
    if (isInsufficientAllowance) return 'Unlock';

    return 'Complete';
  };

  const getIsButtonDisabled = (): boolean => {
    if (!account) return false;
    if (isWrongChain) return false;
    if (orderIsLoading || isActivating || isInsufficientBalance || conditionsIsLoading) return true;
    if (isInsufficientAllowance) return false;

    return false;
  };

  const getIsButtonLoading = () => {
    if (orderIsLoading || isActivating || conditionsIsLoading) return true;

    return false;
  };

  return (
    <Box display={'flex'} flexDirection={'column'} gap={7}>
      {orderIsLoading ? (
        <PaymentDefaultScreenSkeleton />
      ) : (
        <>
          <Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={2} minHeight={48}>
              <Box display={'flex'} alignItems={'flex-end'} gap={2}>
                <Typography variant='h4' fontWeight={700}>
                  {`Order`}
                </Typography>
                <Typography variant='h6'>#{getEllipsisString(order?.id)}</Typography>
              </Box>
              {!!account && <WalletMenu />}
            </Box>
            <Typography variant='subtitle1'>{order?.metadata.description}</Typography>
          </Box>
          <OrderPrice title={'Total amount'} />
          <Box display={'flex'} gap={2}>
            <SelectChain />
            <SelectTokenButton />
          </Box>
          <OrderPrice title={'Token amount'} isTokenPrice />
          <TransactionDetails />
        </>
      )}

      <DefaultButton onClick={onClick} disabled={getIsButtonDisabled()}>
        <Box display={'flex'} gap={2}>
          {getIsButtonLoading() ? <Skeleton width={'80px'} /> : getButtonLabel()}
          {getIsButtonLoading() && <StyledLoader size={20} thickness={6} />}
        </Box>
      </DefaultButton>
    </Box>
  );
};
