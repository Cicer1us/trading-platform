import assert from 'assert';
import { useCallback, useContext, useMemo } from 'react';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { WalletCtx } from 'context/WalletContext';
import { Nft } from 'services/moralis/nft-api';
import { Chain, chainConfigs } from 'utils/chains';
import { setApprovalForAll } from '../../../services/paraswap/orderRequests';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { WidgetScreen } from '../NftWidget/NftWidget';
import toast from 'react-hot-toast';
import { ToastWithLink } from '../../../components/ToasterAlerts/components/ToastWithLink';
import { toasterMessages } from 'components/ToasterAlerts/utils';
import { nftAllowancesQueryKey } from 'hooks/useNftAllowances';

type UseNftAssetAllowanceInput = Pick<
  UseMutationOptions<TransactionResponse, Error>,
  'onMutate' | 'onSuccess' | 'onError'
>;

export const useNftAssetAllowanceRequest = (
  nft: Nft,
  setWidgetScreen: (screen: WidgetScreen) => void // should I move this state to redux or context?
) => {
  const queryClient = useQueryClient();

  const ctx = useContext(WalletCtx);

  const chain = ctx?.walletChain ?? Chain.Ethereum;
  const chainConfig = chainConfigs[chain];
  const chainExplorerUrl = chainConfig.explorerUrl;

  const unlockAsset = useCallback(async (): Promise<TransactionResponse> => {
    assert(ctx?.account && ctx?.library, 'missing required data');

    return setApprovalForAll({
      nftAddress: nft.token_address,
      maker: ctx.account,
      provider: ctx.library,
      chainId: chainConfig.chainIdDecimal,
    });
  }, [nft]);

  const notifications = useMemo(
    () => ({
      loading: (
        <ToastWithLink
          action="loading"
          title={toasterMessages.assetAllowance.loading.title}
          description={toasterMessages.assetAllowance.loading.description}
        />
      ),
      success: (receipt: TransactionReceipt) => (
        <ToastWithLink
          action="success"
          title={toasterMessages.assetAllowance.success.title}
          description={toasterMessages.assetAllowance.success.description}
          receipt={receipt}
          explorerUrl={chainExplorerUrl}
        />
      ),
      error: (
        <ToastWithLink
          action="error"
          title={toasterMessages.assetAllowance.error.title}
          description={toasterMessages.assetAllowance.error.description}
        />
      ),
    }),
    [nft]
  );

  const callbacks: UseNftAssetAllowanceInput = useMemo(
    () => ({
      onSuccess: async (tx: TransactionResponse): Promise<void> => {
        if (!tx) return;

        await toast.promise(tx.wait(), notifications);

        setWidgetScreen(WidgetScreen.Default);
      },

      onError: () => {
        setWidgetScreen(WidgetScreen.Default);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [nftAllowancesQueryKey] });
      },
    }),
    [nft, ctx, chainConfig]
  );

  return useMutation<TransactionResponse, Error>(
    ['nftAssetAllowanceRequest', ctx?.account, nft.token_address],
    unlockAsset,
    callbacks
  );
};
