import env from "../env";
import { signers } from "./networksConfig";
import { CCSmartWallet, CCSmartWallet__factory } from "../../contracts";

export function getSmartWalletContract(networkId: string): CCSmartWallet {
  const smartWallet = CCSmartWallet__factory.connect(
    env.SMART_WALLET_ADDRESS,
    signers[networkId].firstSigner
  );
  return smartWallet;
}
