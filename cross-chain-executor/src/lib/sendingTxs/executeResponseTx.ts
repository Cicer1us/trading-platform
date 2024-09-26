import { usdcToken } from "@bitoftrade/cross-chain-core";
import { ContractTransaction } from "ethers";
import { getSmartWalletContract } from "../../eth";
import { signers } from "../../eth/networksConfig";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function executeResponseTx(
  networkId: string,
  srcTxHash: string,
  srcNetworkId: string,
  value: string,
  calldata: string,
  signature: string,
  destToken: string,
  amount: string,
  userAddress: string
): Promise<ContractTransaction> {
  const isDestTokenUSDC =
    destToken.toLowerCase() ===
    usdcToken[Number(networkId)].address.toLowerCase();
  try {
    const smartWallet = getSmartWalletContract(networkId);
    const transaction = await smartWallet.executeResponseTx(
      signature,
      calldata,
      srcTxHash,
      srcNetworkId,
      value,
      isDestTokenUSDC ? destToken : NULL_ADDRESS,
      amount,
      userAddress,
      { from: smartWallet.address }
    );
    return transaction;
  } catch (error) {
    console.log(error);
    throw new Error("error while executing response tx");
  }
}
