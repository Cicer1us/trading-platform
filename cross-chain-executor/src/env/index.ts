import "dotenv/config";
import { cleanEnv, str, makeValidator, num } from "envalid";

const privateKey = makeValidator((value: string) => {
  if (value.length === 64) {
    return value.toLowerCase();
  }
  throw new Error("is not private key");
});

const ethereumAddress = makeValidator((value: string) => {
  if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
    return value.toLowerCase();
  }
  throw new Error("is not ethereum address");
});

const env = cleanEnv(process.env, {
  PORT: num(),
  NODE_ENV: str({ choices: ["development", "production", "staging"] }),

  EXECUTOR_PK_1: privateKey(),
  EXECUTOR_PK_2: privateKey(),
  EXECUTOR_PK_3: privateKey(),

  RPC_URL_1: str(),
  RPC_URL_4: str(),
  RPC_URL_10: str(),
  RPC_URL_56: str(),
  RPC_URL_137: str(),
  RPC_URL_250: str(),
  RPC_URL_42161: str(),
  RPC_URL_43114: str(),

  SMART_WALLET_ADDRESS: ethereumAddress(),
});

export default env;
