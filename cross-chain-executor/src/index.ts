import express, { Express, Request, Response } from "express";
import cors from "cors";
import env from "./env";
import AppRouter from "./router";

const app: Express = express();

const router = new AppRouter();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

router.configure(app);

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "executor api",
  });
});

try {
  app.listen(env.PORT, (): void => {
    console.log(`Connected successfully on port ${env.PORT}`);
  });
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error occured: ${error.message}`);
  }
}
