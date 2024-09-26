import signMessageAbi from './abi/SignMessageLib.json';
import gnosisSafeAbi from './abi/GnosisSafe.json';
import keyShareManagerAbi from './abi/KeyShareManager.json';
import { SignMessageLib } from '../contracts/types/SignMessageLib';
import { KeyShareManager } from '../contracts/types/KeyShareManager';
import { InitCoreParams, ParsedEvent, Signature } from './types';
import { _verifyAndParseEvent } from './verifyAndParseEvent';
import { BLOCKS_CONFIRMATIONS, Chain } from './constants';

export function initCore({
  web3Providers,
  config: {
    KEY_SHARE_MANAGER_ADDRESS,
    KEY_SHARE_MANAGER_CHAIN_ID,
    ADMIN_GNOSIS_SAFE_ADDRESS,
    ADMIN_GNOSIS_SAFE_CHAIN_ID,
  },
}: InitCoreParams) {
  const protocolProvider = web3Providers[KEY_SHARE_MANAGER_CHAIN_ID];
  const adminGnosisSafeProvider = web3Providers[ADMIN_GNOSIS_SAFE_CHAIN_ID];

  const signMessageContract: SignMessageLib = new protocolProvider.eth.Contract(signMessageAbi);
  const keyShareManager: KeyShareManager = new protocolProvider.eth.Contract(
    keyShareManagerAbi,
    KEY_SHARE_MANAGER_ADDRESS
  );

  function encodeSignedMessage(message: string): string {
    const hashedMessage = protocolProvider.eth.accounts.hashMessage(message);
    return signMessageContract.methods.signMessage(hashedMessage).encodeABI();
  }

  async function getKeyShareAdmins(): Promise<string[]> {
    const keyShareAdmins = await keyShareManager.methods.keyShareAdmins().call();
    return keyShareAdmins.map((admin) => admin.toLowerCase());
  }

  async function getKeyShareHolderByAdmin(keyShareAdmin: string): Promise<string> {
    const keyShareHolder = await keyShareManager.methods.keyShareHolderByAdmin(keyShareAdmin).call();
    return keyShareHolder?.toLowerCase();
  }

  async function getKeyShareAdminIndexOrReject(keyShareAdmin: string): Promise<number> {
    const admins = await getKeyShareAdmins();
    const index = admins.indexOf(keyShareAdmin.toLowerCase());
    if (index === -1) {
      throw new Error(`KeyShareAdmin with address ${keyShareAdmin} doesn't exist`);
    }
    return index + 1;
  }

  async function getIsKeyShareAdmin(keyShareAdmin: string): Promise<boolean> {
    return keyShareManager.methods.isKeyShareAdmin(keyShareAdmin).call();
  }

  async function getKeyShareAdminsIndexes(): Promise<Record<string, number>> {
    const admins = await getKeyShareAdmins();
    const indexes: Record<string, number> = {};
    admins.forEach((admin, index) => (indexes[admin] = index + 1));
    return indexes;
  }

  function recoverAddress({ r, s, v }: Signature, message: string): string {
    const hexedMessage = protocolProvider.eth.accounts.hashMessage(message);
    return protocolProvider.eth.accounts.recover({
      r,
      s,
      v,
      messageHash: hexedMessage,
    });
  }

  function decryptGnosisSafeTransaction(txInput: string): string {
    const methodName = 'execTransaction';
    const inputs = gnosisSafeAbi.find((a) => a.name === methodName)?.inputs ?? [];
    const decoded = protocolProvider.eth.abi.decodeParameters(inputs, txInput.slice(10));
    return decoded?.data ?? '';
  }

  async function verifyGnosisSafeAdminSignedMessageOrReject(
    message: string,
    txHash: string
  ): Promise<void> {
    const tx = await adminGnosisSafeProvider.eth.getTransaction(txHash);
    const receipt = await adminGnosisSafeProvider.eth.getTransactionReceipt(txHash);
    const currentBlock = await adminGnosisSafeProvider.eth.getBlockNumber();

    if (tx?.to?.toLowerCase() !== ADMIN_GNOSIS_SAFE_ADDRESS.toLowerCase()) {
      throw new Error('Message is not signed by gnosis safe');
    }

    if (!receipt?.status) {
      throw new Error('Transaction is failed');
    }

    const actualConfirmationBlocks = currentBlock - receipt.blockNumber;
    const minConfirmationBlocks = BLOCKS_CONFIRMATIONS[Number(KEY_SHARE_MANAGER_CHAIN_ID) as Chain];

    if (actualConfirmationBlocks <= minConfirmationBlocks) {
      throw new Error(`Transaction doesn't have enough block confirmations`);
    }

    const decryptedTxData = decryptGnosisSafeTransaction(tx?.input);
    const encodedMessage = encodeSignedMessage(message);

    if (encodedMessage !== decryptedTxData) {
      throw new Error(`Message doesn't correspond to signed message`);
    }
  }

  async function getCurrentSigner(): Promise<string> {
    const signer = await keyShareManager.methods.signer().call();
    return signer?.toLowerCase();
  }

  async function verifyAndParseEventOrReject(
    chainId: number,
    txHash: string,
    abi: any,
    eventLogIndex?: number
  ): Promise<ParsedEvent> {
    try {
      return _verifyAndParseEvent(web3Providers, chainId, txHash, abi, eventLogIndex);
    } catch (error: any) {
      throw new Error(`Event verification failed: ${error.message}`);
    }
  }

  return {
    verifyGnosisSafeAdminSignedMessageOrReject,
    recoverAddress,
    getKeyShareHolderByAdmin,
    getKeyShareAdminIndexOrReject,
    getCurrentSigner,
    getKeyShareAdminsIndexes,
    getKeyShareAdmins,
    verifyAndParseEventOrReject,
    getIsKeyShareAdmin,
  };
}
