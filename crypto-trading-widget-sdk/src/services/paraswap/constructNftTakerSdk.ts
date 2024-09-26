import {
  constructApproveTokenForNFTOrder,
  constructAxiosFetcher,
  constructBuildNFTOrder,
  constructBuildNFTOrderTx,
  constructEthersContractCaller,
  constructPartialSDK,
  constructSignNFTOrder,
} from '@paraswap/sdk';
import axios from 'axios';
import { BaseProvider } from '@ethersproject/providers';
import { Chain, chainConfigs } from '../../utils/chains';
import { Contract } from '@ethersproject/contracts';

export const axiosFetcher = constructAxiosFetcher(axios);

export const constructNftTakerSdk = (library: BaseProvider, chain: Chain, account?: string) => {
  const takerEthersContractCaller = constructEthersContractCaller(
    {
      ethersProviderOrSigner: library,
      EthersContract: Contract,
    },
    account
  );

  return constructPartialSDK(
    {
      chainId: chainConfigs[chain].chainIdDecimal,
      contractCaller: takerEthersContractCaller,
      fetcher: axiosFetcher,
    },
    constructBuildNFTOrder,
    constructSignNFTOrder,
    constructApproveTokenForNFTOrder,
    constructBuildNFTOrderTx
  );
};
