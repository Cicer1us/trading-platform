import assert from 'assert';
import dayjs, { ManipulateType } from 'dayjs';
import { Nft } from 'services/moralis/nft-api';
import { createOrder } from 'services/paraswap/orderRequests';
import { Chain, chainConfigs } from 'utils/chains';
import { decimalsToWeiUnit } from 'utils/common';
import { Token } from 'data/tokens/token.interface';
import Web3 from 'web3';
import { WalletCtx } from 'context/WalletContext';
import { useCallback, useContext, useMemo } from 'react';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { toasterMessages } from 'components/ToasterAlerts/utils';
import { ToastWithLink } from 'components/ToasterAlerts/components/ToastWithLink';

type UseCreateOrderInput = Pick<UseMutationOptions<NFTOrderFromAPI, Error>, 'onMutate' | 'onSuccess' | 'onError'>;

interface CreateOrderData {
  durationAmount: string;
  durationUnits: ManipulateType;
  receiveAmount: string;
  selectedToken?: Token;
}

export const useCreateNftOrder = (nft: Nft, createOrderData: CreateOrderData) => {
  const ctx = useContext(WalletCtx);
  const queryClient = useQueryClient();
  const chain = ctx?.walletChain ?? Chain.Ethereum;

  const { durationAmount, durationUnits, receiveAmount, selectedToken } = createOrderData;

  const handleOrderCreation = useCallback(async (): Promise<NFTOrderFromAPI> => {
    assert(ctx?.account && ctx?.library && receiveAmount && selectedToken, 'missing required data or input');

    return createOrder({
      nft,
      expiry: dayjs().add(Number(durationAmount), durationUnits).unix(),
      maker: ctx.account,
      tokenAddress: selectedToken.address,
      tokenAmount: Web3.utils.toWei(receiveAmount, decimalsToWeiUnit[selectedToken.decimals]),
      provider: ctx.library,
      chainId: chainConfigs[chain].chainIdDecimal,
    });
  }, [nft, createOrderData]);

  const callbacks: UseCreateOrderInput = useMemo(
    () => ({
      onSuccess: (order: NFTOrderFromAPI): void => {
        toast.success(
          <ToastWithLink
            action="success"
            title={toasterMessages.createOrder.success.title}
            description={toasterMessages.createOrder.success.description}
          />
        );

        const existingOrders = queryClient.getQueryState([
          'nftOrders',
          ctx?.account,
          chainConfigs[chain].chainIdDecimal,
        ]);
        if (!existingOrders) return;

        const orders = [...(existingOrders.data as NFTOrderFromAPI[]), order];

        queryClient.setQueryData(['nftOrders', ctx?.account, chainConfigs[chain].chainIdDecimal], orders);
      },
      onError: () => {
        toast.error(
          <ToastWithLink
            action="error"
            title={toasterMessages.createOrder.error.title}
            description={toasterMessages.createOrder.error.description}
          />
        );
      },
    }),
    [nft]
  );

  return useMutation<NFTOrderFromAPI, Error>(
    ['createNftOrder', ctx?.account, nft.token_address],
    handleOrderCreation,
    callbacks
  );
};
