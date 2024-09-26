import { WaitingTxContent } from '../txStatusContent/WaitingTxContent';

export const PaymentWaitingScreen: React.FC = () => {
  return (
    <WaitingTxContent
      title={'Payment in the process'}
      description={'Please wait for the confirmation of the transaction. It takes some time.'}
    />
  );
};
