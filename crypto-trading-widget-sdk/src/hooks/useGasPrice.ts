import { useQuery } from '@tanstack/react-query';
import { Web3Provider } from '@ethersproject/providers';
import Web3 from 'web3';
import { Chain, chainConfigs } from '../utils/chains';

const POOL_TIME = 1000 * 60 * 5;

export const useGasPrice = (chain: Chain, library?: Web3Provider) => {
  return useQuery({
    queryKey: ['gasPrice', library?.network?.chainId],
    queryFn: async () => {
      if (library && library?.network?.chainId === chainConfigs[chain].chainIdDecimal) {
        const gas = await library.getGasPrice();
        return Web3.utils.fromWei(gas.toString());
      } else {
        const provider = new Web3.providers.HttpProvider(chainConfigs[chain].rpcUrl);
        const web3 = new Web3(provider);
        const gas = await web3.eth.getGasPrice();
        return Web3.utils.fromWei(gas);
      }
    },
    cacheTime: POOL_TIME,
    staleTime: POOL_TIME,
  });
};
