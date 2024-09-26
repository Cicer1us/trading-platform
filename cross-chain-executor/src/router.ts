import { Router, Express, Response } from "express";
import { networksConfig } from "./eth/networksConfig";
import {
  executeArbitraryTx,
  executeUpdateSignerTx,
  executeResponseTx,
} from "./lib/sendingTxs";
import {
  ArbitraryTxBody,
  ResponseTxBody,
  TypedRequestBody,
  UpdateSignerTxBody,
} from "./types";

const router = Router({});

export default class AppRouter {
  app: Express;

  configure(app: Express): void {
    this.app = app;
    this.setRoutes();
  }

  private setRoutes(): void {
    this.app.use("/", this.setAPIRoutes());
  }

  //@TODO: add swagger ui
  private setAPIRoutes(): Router {
    router.post(
      "/execute-arbitrary-tx",
      async (
        request: TypedRequestBody<ArbitraryTxBody>, //@TODO: add body validation
        response: Response
      ) => {
        try {
          if (!networksConfig[request.body.networkId])
            throw new Error("invalid network id");

          const transaction = await executeArbitraryTx(
            request.body.networkId,
            request.body.to,
            request.body.value,
            request.body.calldata,
            request.body.signature
          );
          const receipt = await transaction.wait(6);
          response.status(200).send(receipt);
        } catch (e) {
          response.status(500).send(e);
        }
      }
    );

    router.post(
      "/execute-update-singer-tx",
      async (
        request: TypedRequestBody<UpdateSignerTxBody>, //@TODO: add body validation
        response: Response
      ) => {
        try {
          if (!networksConfig[request.body.networkId])
            throw new Error("invalid network id");

          const transaction = await executeUpdateSignerTx(
            request.body.networkId,
            request.body.nesSigner,
            request.body.signature
          );
          const receipt = await transaction.wait(6);
          response.status(200).send(receipt);
        } catch (e) {
          response.status(500).send(e);
        }
      }
    );

    router.post(
      "/execute-response-tx",
      async (
        request: TypedRequestBody<ResponseTxBody>, //@TODO: add body validation
        response: Response
      ) => {
        try {
          if (!networksConfig[request.body.networkId])
            throw new Error("invalid network id");

          const transaction = await executeResponseTx(
            request.body.networkId,
            request.body.srcTxHash,
            request.body.srcNetworkId,
            request.body.value,
            request.body.calldata,
            request.body.signature,
            request.body.destToken,
            request.body.amount,
            request.body.userAddress
          );
          const receipt = await transaction.wait(6);
          response.status(200).send(receipt);
        } catch (e) {
          response.status(500).send({ error: e.message });
        }
      }
    );
    return router;
  }
}
