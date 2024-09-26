import { useCallback } from 'react';
import { useAppDispatch } from 'src/store/hooks/reduxHooks';
import { setPaymentScreen, PaymentScreen } from 'src/store/payment/slice';
import { ConfirmedTxContent } from '../txStatusContent/ConfirmedTxContent';

export const UnlockSuccessScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleDismiss = useCallback(() => {
    dispatch(setPaymentScreen(PaymentScreen.DEFAULT));
  }, [dispatch]);

  return (
    <ConfirmedTxContent
      title={'Unlock is approved'}
      description={'The transaction is submitted to the blockchain and is currently being processed.'}
      buttonContent={'Dismiss'}
      onClick={handleDismiss}
    />
  );
};
