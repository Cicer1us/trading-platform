import { ParsedEvent, Web3Providers } from './types';
import { JsonFragment, Interface } from '@ethersproject/abi';
import { keccak256 } from '@ethersproject/solidity';
import { BLOCKS_CONFIRMATIONS, Chain } from './constants';

// Steps to verify and parse events

// 1. Transaction was successful
// 2. Transaction was completed n-th block ago
// 3. Transaction has necessary event log

// 4. First five args make unique id for any event:
// (eventName, chainId, contractAddress, transactionHash)

// 5. Create and return sha3 hash from event : sha3(...eventId, ...eventParams)

interface EventLog {
  topics: string[];
  data: string;
  logIndex: number;
  address: string;
}

export async function _verifyAndParseEvent(
  web3Providers: Web3Providers,
  chainId: Chain,
  txHash: string,
  abi: JsonFragment,
  eventLogIndex?: number
): Promise<ParsedEvent> {
  try {
    const provider = web3Providers[chainId];
    const logs = await verifyTransactionAndExtractLogs(provider, chainId, txHash);

    const iface = new Interface([abi]);
    const eventSignature = iface.getEventTopic(abi.name ?? '');

    // find also by logIndex if provided
    const log = logs.find((log) => log.topics[0] === eventSignature && (!eventLogIndex || log.logIndex === eventLogIndex));
    if (!log) throw new Error(`Current event doesn't exist in this transaction.`);

    const parsedLog = iface.parseLog(log);
    if (!parsedLog) throw new Error('Failed to parse event. Please check your abi.');

    // (eventName, srcChainId, contractAddress, srcTransactionHash)
    // required types and values
    const types = ['string', 'uint256', 'address', 'bytes32'];
    const values = [parsedLog.name, chainId, log.address, txHash];

    // adding params from event
    parsedLog.eventFragment.inputs.forEach((input) => {
      types.push(input.type);
      values.push(parsedLog.args[input.name].toString());
    });

    return {
      params: values,
      paramsHash: keccak256(types, values),
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function verifyTransactionAndExtractLogs(
  provider: any,
  chainId: Chain,
  txHash: string
): Promise<EventLog[]> {
  const transactionReceipt = await provider.eth.getTransactionReceipt(txHash);
  const currentBlock = await provider.eth.getBlockNumber();

  if (!transactionReceipt?.status) {
    throw new Error(`Transaction doesn't exist or failed`);
  }

  const actualConfirmationBlocks = currentBlock - transactionReceipt.blockNumber;
  const minConfirmationBlocks = BLOCKS_CONFIRMATIONS[chainId] ?? 0;

  if (actualConfirmationBlocks <= minConfirmationBlocks) {
    throw new Error(
      `Transaction doesn't have enough block confirmations, currentBlock: ${currentBlock}, txBlock: ${transactionReceipt.blockNumber}`
    );
  }

  return transactionReceipt.logs;
}
