import { NftAllowanceProps, useNftAllowances } from 'hooks/useNftAllowances';
import { Nft } from 'services/moralis/nft-api';
import { chainConfigs } from '../../../utils/chains';
import { useWalletContext } from 'context/WalletContext';

export type NftAllowanceForSelectedNft = Pick<NftAllowanceProps, 'addresses'> & {
  selectedNft: Nft;
};
export const useNftsAllowanceForSelectedNft = (props: NftAllowanceForSelectedNft): boolean | undefined => {
  const ctx = useWalletContext();
  const chainId = ctx.walletChain && chainConfigs[ctx.walletChain].chainIdDecimal;
  const userAccount = ctx.account;
  const { selectedNft, addresses } = props;
  const { data: nftAllowances } = useNftAllowances({ userAccount, chainId, addresses });
  const isAllowed = nftAllowances?.[selectedNft.token_address];
  if (isAllowed === undefined) return undefined;
  return Number(isAllowed) ? true : false;
};
