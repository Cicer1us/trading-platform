import express, { Application, Request, Response } from "express";
import cors from "cors";
import BidController from "./controllers/get-bid.controller";
import NotifyController from "./controllers/notify-1st-tx-sent.controller";
import { initBlockListener } from "./web3";
import { PORT } from "./env";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Hello World!",
  });
});

initBlockListener();

app.use("/bid", BidController());
app.use("/", NotifyController());

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}
