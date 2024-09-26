import web3 from "web3";
import axios from "axios";
import { Router, Request, Response } from "express";
import { OptimalRate, SwapSide } from "paraswap-core";
import { ParaSwap, NetworkID } from "paraswap";
import {
  PriceRequest,
  FirstBid,
  SecondBid,
} from "@bitoftrade/cross-chain-types";
import { CROSS_CHAIN_API_URL } from "../env";
import { reportError } from "../utils/report-error";

// @TODO: add config with all supported networks and set USDC next to native token
const USDC_BSC_TOKEN_ADDRESS = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
const BSC_SMART_WALLET_ADDRESS = "0xF995764F0ad0A097bF3f2011205f0bbE1674F0DE";

const USDC_AVALANCHE_TOKEN_ADDRESS =
  "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664";
const USDC_POLYGON_TOKEN_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const POLYGON_SMART_WALLET_ADDRESS =
  "0xd6905E2B6e0f43dc28407911B62806ae6F79Eed6";

function getParaswapSDK(networkId: NetworkID): ParaSwap {
  const paraswap = new ParaSwap(networkId);
  return paraswap;
}

async function generateFirstBid(
  priceRequest: PriceRequest
): Promise<FirstBid | undefined> {
  const paraswapSourceNetwork = getParaswapSDK(
    priceRequest.srcNetworkId as NetworkID
  );

  try {
    const priceRouteOrError = await paraswapSourceNetwork.getRate(
      priceRequest.srcToken,
      USDC_POLYGON_TOKEN_ADDRESS,
      web3.utils.toWei(priceRequest.amount), //@TODO: handle token decimals
      priceRequest.userAddress,
      priceRequest.side as SwapSide,
      undefined,
      priceRequest.srcTokenDecimals,
      6
    );

    if ("message" in priceRouteOrError) {
      throw new Error(priceRouteOrError.message);
    }

    const transactionRequestOrError = await paraswapSourceNetwork.buildTx(
      priceRouteOrError.srcToken,
      priceRouteOrError.destToken,
      priceRouteOrError.srcAmount,
      priceRouteOrError.destAmount,
      priceRouteOrError,
      priceRequest.userAddress,
      undefined, //@TODO: deal with undefined instead of arguments
      undefined,
      undefined,
      POLYGON_SMART_WALLET_ADDRESS,
      { ignoreChecks: true }
    );

    if ("message" in transactionRequestOrError) {
      throw new Error(transactionRequestOrError.message);
    }

    return {
      estimatedGasPriceWei: priceRouteOrError.gasCost,
      receiveUSDCAmount: web3.utils.fromWei(
        priceRouteOrError.destAmount,
        "mwei"
      ),
      value: transactionRequestOrError.value,
      calldata: transactionRequestOrError.data,
      to: transactionRequestOrError.to,
    };
  } catch (error) {
    reportError(error);
  }
}

async function generateSecondBid(
  firstBid: FirstBid
): Promise<SecondBid | undefined> {
  const { data: priceRequest } = await axios.get<PriceRequest>(
    `${CROSS_CHAIN_API_URL}/price_request/${firstBid.priceRequestId}`
  );
  const paraswapTargetNetwork = getParaswapSDK(
    priceRequest.destNetworkId as NetworkID
  );

  try {
    const priceRouteOrError = await paraswapTargetNetwork.getRate(
      USDC_BSC_TOKEN_ADDRESS,
      priceRequest.destToken,
      web3.utils.toWei(firstBid.receiveUSDCAmount),
      BSC_SMART_WALLET_ADDRESS,
      "SELL" as SwapSide,
      undefined,
      18,
      priceRequest.destTokenDecimals
    );

    if ("message" in priceRouteOrError) {
      throw new Error(priceRouteOrError.message);
    }

    const txParamsOrError = await paraswapTargetNetwork.buildTx(
      priceRouteOrError.srcToken,
      priceRouteOrError.destToken,
      priceRouteOrError.srcAmount,
      priceRouteOrError.destAmount,
      priceRouteOrError,
      BSC_SMART_WALLET_ADDRESS,
      undefined,
      undefined,
      undefined,
      priceRequest.userAddress,
      { ignoreChecks: true }
    );

    if ("message" in txParamsOrError) {
      throw new Error(txParamsOrError.message);
    }

    return {
      estimatedGasPriceWei: priceRouteOrError.gasCost,
      value: txParamsOrError.value,
      calldata: txParamsOrError.data,
      to: txParamsOrError.to,
      receiveAmountOfTargetToken: web3.utils.fromWei(
        priceRouteOrError.destAmount
      ),
      marketMakerId: 1,
    };
  } catch (error) {
    reportError(error);
  }
}

export default (): Router => {
  const bidRouter = Router();
  bidRouter.post(
    "/1st_round",
    async (request: Request<{}, {}, PriceRequest>, response: Response) => {
      const bid = await generateFirstBid(request.body);
      response.send(bid).status(200);
    }
  );
  bidRouter.post(
    "/2nd_round",
    async (request: Request<{}, {}, FirstBid>, response: Response) => {
      const bid = await generateSecondBid(request.body);
      response.send(bid).status(200);
    }
  );
  return bidRouter;
};
