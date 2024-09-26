import { Request, Response, Router } from "express";
import { PriceRequestWithBids } from "@bitoftrade/cross-chain-types";
import { BlockListener } from "../web3/blockListener";

interface CustomRequest<T> extends Request {
  body: T;
}

export default (): Router => {
  const executeSwap = Router();

  executeSwap.post(
    "/notify1stTxSent",
    (
      request: CustomRequest<{
        priceRequestWithBids: PriceRequestWithBids;
      }>,
      response: Response
    ) => {
      console.log({ request: request.body });
      BlockListener.getInstance().storePendingSafe1stTx(
        request.body.priceRequestWithBids
      );
      response.send().status(200);
    }
  );

  return executeSwap;
};
