import fs from "fs";
import { BlockTransactionObject } from "web3-eth";
import { AbiItem } from "web3-utils";
import { PriceRequestWithBids } from "@bitoftrade/cross-chain-types";
import { web3bscRpc, web3polygonRpc } from "./providers";
import smartWalletAbi from "./abis/smartWallet.json";
import { SmartWallet } from "./abis/typechain";
import { reportError } from "../utils/report-error";
import {
  CROSS_CHAIN_API_URL,
  ETH_GENESIS_BLOCK,
  EXECUTOR_ADDRESS,
} from "../env";
import axios from "axios";

const LAST_FETCHED_BLOCK = ".last_fetched_block";

export function constructContract<TContract>(
  contractAddress: string,
  abi: unknown
): TContract {
  return new web3bscRpc.eth.Contract(
    abi as AbiItem,
    contractAddress
  ) as unknown as TContract;
}

const smartWallet = constructContract<SmartWallet>(
  "0xF995764F0ad0A097bF3f2011205f0bbE1674F0DE", //@TODO: move to network config file
  smartWalletAbi.abi
);

export class BlockListener {
  static instance: BlockListener;

  lastFetchedBlock: number;
  pendingSafe1stTx: PriceRequestWithBids[] = [];

  static getInstance(): BlockListener {
    if (!this.instance) {
      this.instance = new BlockListener();
    }
    return this.instance;
  }

  storePendingSafe1stTx(priceRequest: PriceRequestWithBids) {
    this.pendingSafe1stTx.push(priceRequest);
  }

  constructor() {
    this.lastFetchedBlock = fs.existsSync(LAST_FETCHED_BLOCK)
      ? Number(fs.readFileSync(LAST_FETCHED_BLOCK).toString())
      : Number(ETH_GENESIS_BLOCK);
  }

  updateLastFetchedBlock(latestBlockNumber: number) {
    const newLastFetchedBlock = Math.max(
      latestBlockNumber,
      this.lastFetchedBlock
    );
    fs.writeFileSync(LAST_FETCHED_BLOCK, newLastFetchedBlock.toString());
    return newLastFetchedBlock;
  }

  async onNewBlock(latestBlockNumber: number): Promise<void> {
    if (latestBlockNumber <= this.lastFetchedBlock) return;

    const newLastFetchedBlock = this.updateLastFetchedBlock(latestBlockNumber);

    const blockNumbers = [
      ...Array(newLastFetchedBlock - this.lastFetchedBlock).keys(),
    ].map((v) => this.lastFetchedBlock + v + 1);

    this.lastFetchedBlock = newLastFetchedBlock;

    console.log({ blockNumbers });

    const blocks = await Promise.all(
      blockNumbers.map(async (blockNumber) => {
        const block = await web3polygonRpc.eth.getBlock(blockNumber, true);
        return block;
      })
    );

    await this.processBlocks(blocks, this.pendingSafe1stTx);
  }

  async processBlocks(
    blocks: BlockTransactionObject[],
    pendingSafe1stTxs: PriceRequestWithBids[]
  ) {
    const requestsToProcess = pendingSafe1stTxs.filter((priceRequest) =>
      blocks
        .map(({ transactions }) => transactions)
        .flat()
        .filter(
          ({ input, from }) =>
            priceRequest.userAddress.toLowerCase() === from.toLowerCase() &&
            priceRequest.firstBid.calldata === input
        )
    );
    console.log({ requestsToProcess });
    if (!requestsToProcess.length) return;

    const from = web3bscRpc.eth.accounts.wallet[0].address;

    const accountNonce = await web3bscRpc.eth.getTransactionCount(
      EXECUTOR_ADDRESS
    );

    const sentTansactions = await Promise.all(
      requestsToProcess.map(async (priceRequest) => {
        try {
          console.log({ priceRequest });
          const txRecipt = await smartWallet.methods
            .execute(
              priceRequest.secondBid.to,
              priceRequest.secondBid.calldata,
              priceRequest.secondBid.value
            )
            .send({
              from,
              gas: 500000, //@TODO: pass estimate gas limit from second bid
              nonce: accountNonce,
            })
            .on("transactionHash", async (txHash) => {
              await axios.put(
                `${CROSS_CHAIN_API_URL}/notify2ndTxSent/${priceRequest.secondBid.priceRequestId}`,
                {
                  txHash,
                }
              );
              const newPendingTxArray = this.pendingSafe1stTx.filter(
                (pend) =>
                  pend.userAddress !== priceRequest.userAddress &&
                  pend.userSignature !== priceRequest.userSignature &&
                  pend.secondBid.calldata !== priceRequest.secondBid.calldata
              );
              this.pendingSafe1stTx = newPendingTxArray;
            })
            .on("receipt", async (receipt) => {
              await axios.put(
                `${CROSS_CHAIN_API_URL}/notify2ndTxMined/${priceRequest.secondBid.priceRequestId}`,
                {
                  status: "finished",
                }
              );
            });
          return txRecipt;
        } catch (error) {
          reportError(error);
        }
      })
    );

    console.log({ sentTansactions });
  }
}
