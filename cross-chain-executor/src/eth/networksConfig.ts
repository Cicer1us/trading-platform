import env from "../env";
import { JsonRpcProvider } from "@ethersproject/providers";
import { CONFIG as SUPPORTED_CHAINS } from "@bitoftrade/cross-chain-core";
import { Wallet } from "ethers";

type NetworkConfig = {
  chainId: number;
  rpcUrl: string;
  provider: JsonRpcProvider;
};

function generateNetworksConfig(): Record<string, NetworkConfig> {
  return Object.keys(SUPPORTED_CHAINS).reduce(
    (acc, networkId: string) => {
      const rpcUrl = `RPC_URL_${networkId}` as keyof typeof env;
      if (!env[rpcUrl]) throw new Error("unsupported network id");
      return {
        ...acc,
        [networkId]: {
          chainId: networkId,
          rpcUrl: env[rpcUrl],
          provider: new JsonRpcProvider(env[rpcUrl].toString()),
        },
      };
    },
    {}
  );
}

export const networksConfig = generateNetworksConfig();

type Signers = {
  firstSigner: Wallet;
  secondSigner: Wallet;
  thirdSigner: Wallet;
};

function getSigners(): Record<string, Signers> {
  return Object.keys(networksConfig).reduce(
    (acc, networkId) => ({
      ...acc,
      [networkId]: {
        firstSigner: new Wallet(
          env.EXECUTOR_PK_1,
          networksConfig[networkId].provider
        ),
        secondSigner: new Wallet(
          env.EXECUTOR_PK_2,
          networksConfig[networkId].provider
        ),
        thirdSigner: new Wallet(
          env.EXECUTOR_PK_3,
          networksConfig[networkId].provider
        ),
      },
    }),
    {}
  );
}

export const signers = getSigners();
