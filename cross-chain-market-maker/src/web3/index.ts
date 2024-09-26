import axios from "axios";
import { PriceRequestWithBids } from "@bitoftrade/cross-chain-types";
import { CROSS_CHAIN_API_URL } from "../env";
import { BlockListener } from "./blockListener";
import { web3polygonRpc } from "./providers";

const MARKET_MAKER_ID = 1;

const blockListener = BlockListener.getInstance();

const handleNewBlock = (blockNumber: number) => {
  const safeBlockNumber = blockNumber - 6;
  blockListener.onNewBlock(safeBlockNumber);
};

function catchUpAfterOffline(): void {
  axios
    .get<PriceRequestWithBids[]>(
      `${CROSS_CHAIN_API_URL}/waiting_for_execution_2nd_txs/${MARKET_MAKER_ID}`
    )
    .then(({ data: pendingPriceRequestToExecute }) => {
      if (pendingPriceRequestToExecute.length <= 0) return;
      pendingPriceRequestToExecute.forEach((priceRequest) => {
        blockListener.storePendingSafe1stTx(priceRequest);
      });
    })
    .catch((error) => console.error(error));
}

export function initBlockListener(): void {
  catchUpAfterOffline();
  setInterval(async () => {
    try {
      const blockNumber = await web3polygonRpc.eth.getBlockNumber();
      handleNewBlock(blockNumber);
    } catch (err) {
      console.log(err);
    }
  }, 5000);
}
