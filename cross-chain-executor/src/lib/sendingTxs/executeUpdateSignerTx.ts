import { ContractTransaction } from "ethers";
import { getSmartWalletContract } from "../../eth";
import { signers } from "../../eth/networksConfig";

export async function executeUpdateSignerTx(
  networkId: string,
  newSinger: string,
  signature: string
): Promise<ContractTransaction> {
  try {
    const smartWallet = getSmartWalletContract(networkId);
    const transaction = await smartWallet.updateSigner(newSinger, {
      from: signers[networkId].firstSigner.address, //@TODO: implement free executor algorithm
    });
    return transaction;
  } catch (error) {
    console.log(error);
    throw new Error("error while executing arbitrary tx");
  }
}
