import { useQuery } from '@tanstack/react-query';
import { bitoftradeUtils } from '../utils/bitoftradeUtils';
import { assert } from 'ts-essentials';

export type NftAllowanceProps = {
  userAccount?: string;
  chainId?: number;
  addresses: string[];
};
export const nftAllowancesQueryKey = 'nftAllowances';
export const useNftAllowances = ({ userAccount, chainId, addresses }: NftAllowanceProps) => {
  return useQuery({
    queryKey: [nftAllowancesQueryKey, userAccount, chainId, addresses],
    queryFn: () => {
      assert(userAccount && chainId, "userAccount && chainId are guaranteed by 'enabled'");
      return bitoftradeUtils.getMultipleNftAllowance(userAccount, chainId, addresses);
    },
    enabled: !!userAccount && !!chainId && !!addresses,
  });
};
