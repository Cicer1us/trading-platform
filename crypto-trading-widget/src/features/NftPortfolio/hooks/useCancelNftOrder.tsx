import assert from 'assert';
import { useContext, useMemo } from 'react';
import { WalletCtx } from 'context/WalletContext';

import { Chain, chainConfigs } from 'utils/chains';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { cancelOrder } from 'services/paraswap/orderRequests';
import { ContractTransaction } from '@ethersproject/contracts';
import { TransactionReceipt } from '@ethersproject/providers';

import toast from 'react-hot-toast';
import { ToastWithLink } from '../../../components/ToasterAlerts/components/ToastWithLink';
import { toasterMessages } from 'components/ToasterAlerts/utils';

type UseCreateOrderInput = Pick<UseMutationOptions<ContractTransaction, Error>, 'onMutate' | 'onSuccess' | 'onError'>;

export const useCancelNftOrder = (order: NFTOrderFromAPI) => {
  const ctx = useContext(WalletCtx);
  const queryClient = useQueryClient();
  const chain = ctx?.walletChain ?? Chain.Ethereum;
  const chainId = chainConfigs[chain].chainIdDecimal;
  const chainExplorerUrl = chainConfigs[chain].explorerUrl;

  const handleOrderCancellation = async (): Promise<ContractTransaction> => {
    assert(ctx?.account && ctx?.library, 'missing required data');

    return cancelOrder({
      orderHash: order.orderHash,
      provider: ctx.library,
      maker: ctx.account,
      chainId,
    });
  };

  const notifications = useMemo(
    () => ({
      loading: (
        <ToastWithLink
          action="loading"
          title={toasterMessages.cancelOrder.loading.title}
          description={toasterMessages.cancelOrder.loading.description}
        />
      ),
      success: (receipt: TransactionReceipt) => (
        <ToastWithLink
          action="success"
          title={toasterMessages.cancelOrder.success.title}
          description={toasterMessages.cancelOrder.success.description}
          receipt={receipt}
          explorerUrl={chainExplorerUrl}
        />
      ),
      error: (
        <ToastWithLink
          action="error"
          title={toasterMessages.cancelOrder.error.title}
          description={toasterMessages.cancelOrder.error.description}
        />
      ),
    }),
    [order]
  );

  const callbacks: UseCreateOrderInput = useMemo(
    () => ({
      onSuccess: async (tx: ContractTransaction): Promise<void> => {
        if (!tx) return;

        await toast.promise(tx.wait(), notifications);

        queryClient.invalidateQueries(['nftOrders', ctx?.account, chainConfigs[chain].chainIdDecimal]);
      },
    }),
    [order]
  );

  return useMutation<ContractTransaction, Error>(
    ['cancelNftOrder', order.orderHash],
    handleOrderCancellation,
    callbacks
  );
};
