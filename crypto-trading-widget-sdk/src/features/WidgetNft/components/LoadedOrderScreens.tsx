import React, { useContext, useEffect, useMemo } from 'react';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { OngoingTransactionsCtx, TransactionType } from 'context/OngoingTransactionsContext';
import { NftBookedScreen } from './NftBookedScreen';
import { NftWidgetScreens } from './NftWidgetScreens';
import { PurchaseTxStatusScreen } from './PurchaseTxStatusScreen';
import { useAppDispatch } from '../../../redux/hooks/reduxHooks';
import { setTakerTokenAddress } from '../../../redux/nftWidgetSlice';

interface LoadedOrderScreensProps {
  order: NFTOrderFromAPI;
}

export const LoadedOrderScreens: React.FC<LoadedOrderScreensProps> = ({ order }) => {
  const { ongoingTransactions } = useContext(OngoingTransactionsCtx);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (order) {
      dispatch(setTakerTokenAddress(order.takerAsset));
    }
  }, [order]);

  const ongoingPurchaseTransaction = useMemo(
    () =>
      ongoingTransactions?.filter(
        tx => tx.transactionType === TransactionType.NftPurchase && tx.order.orderHash === order.orderHash
      )[0],
    [ongoingTransactions, order?.orderHash]
  );

  return (
    <>
      {ongoingPurchaseTransaction ? (
        <PurchaseTxStatusScreen order={order} />
      ) : (
        <>
          {order?.state !== 'PENDING' && <NftBookedScreen />}
          {order?.state === 'PENDING' && <NftWidgetScreens order={order} />}
        </>
      )}
    </>
  );
};
