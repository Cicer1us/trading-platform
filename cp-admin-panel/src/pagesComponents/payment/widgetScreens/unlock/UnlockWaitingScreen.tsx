import { WaitingTxContent } from '../txStatusContent/WaitingTxContent';

export const UnlockWaitingScreen = () => {
  return (
    <WaitingTxContent
      title={'Waiting for unlock'}
      description={'Please confirm the transaction on your wallet to unlock USDC'}
    />
  );
};
