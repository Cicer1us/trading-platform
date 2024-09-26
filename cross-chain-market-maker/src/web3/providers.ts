import Web3 from "web3";
import { BSC_RPC_URL, EXECUTOR_PK, POLYGON_RPC_URL } from "../env";

export const web3polygonRpc = new Web3(POLYGON_RPC_URL);
export const web3bscRpc = new Web3(BSC_RPC_URL);

const account = web3bscRpc.eth.accounts.privateKeyToAccount(EXECUTOR_PK);
web3bscRpc.eth.accounts.wallet.add(account);
