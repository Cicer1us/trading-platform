export const DEFAULT_MESSAGE_TO_SIGN = 'btf-cross-chain-security';

export interface AuthToken extends Signature {
  message: string;
  keyShareAdmin: string;
}

export interface Signature {
  r: string;
  s: string;
  v: string;
}

export interface KeyGenParams {
  type: SignedMsgType.KEY_GEN;
  parties: number;
  threshold: number;
}

export interface ConnectTssClientParams {
  type: SignedMsgType.CONNECT_TSS_CLIENT;
  expiryTime: number;
  keyShareManagerAddress: string;
  keyShareManagerChainId: string;
	adminGnosisSafeAddress: string
	adminGnosisSafeChainId: string
  availableChains: number[]
}

export enum SignedMsgType {
  KEY_GEN = 'key_gen',
  DISCONNECT_TSS_CLIENT = 'disconnect_tss_client',
  CONNECT_TSS_CLIENT = 'connect_tss_client',
  UPDATE_KEY_SHARE_HOLDER = 'update_key_share_holder',
}

export interface ApproveSignParams {
  index: number;
  parties: number;
  threshold: number;
  signer: string;
}

export type Web3Providers = Record<string, any>;

export interface InitCoreParams {
  web3Providers: Web3Providers;
  config: {
    KEY_SHARE_MANAGER_ADDRESS: string;
    KEY_SHARE_MANAGER_CHAIN_ID: string;
    ADMIN_GNOSIS_SAFE_ADDRESS: string;
    ADMIN_GNOSIS_SAFE_CHAIN_ID: string;
  };
}

export interface ParsedEvent {
  params: (string | number)[];
  paramsHash: string;
}
