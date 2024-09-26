import Web3 from 'web3';
import { LimitOrder, SignatureType } from '@0x/protocol-utils';
import { fullCurrencyAbi } from './data/currencyAbi';
import { SwapTxObjDto } from '@/interfaces/SwapObjectDto';
import { LimitObjToSign } from '@/interfaces/LimitObjToSign.interface';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { BigNumber, NULL_ADDRESS } from '@0x/utils';
import { MetamaskSubprovider, SupportedProvider } from '@0x/subproviders';
import { SignedLimitOrder } from '@/interfaces/LimitOrder.interface';
import ZeroXAbi from './data/0x-abi';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';
import { isMobile } from 'react-device-detect';
import { Chains, chains } from '../../connection/chainConfig';
import { convertFromWei } from '@/helpers/convertFromToWei';
import { Fragment } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { Contract, Provider } from 'ethers-multicall';
import { Token } from '@/interfaces/Tokens.interface';
import { getT } from '@/hooks/useMultilingual';
import { LimitRaw } from '@/interfaces/Limit.interface';
import { Web3Provider } from '@ethersproject/providers';

// This file was written almost 2 years ago. Most of the part are deprecated.
// TODO: refactor this file to use ethers.js instead of web3.js

export interface TradeTypeProps {
  tokenA?: string;
  tokenB?: string;
  direction?: string;
  positionToken?: string;
}

interface Allowance {
  clientAddress: string;
  allowanceTo: string;
  token: string;
  chainId: number;
  decimals: number;
}

export interface TradeInfo {
  clientAddress: string;
  tradeType?: 'Leverage' | 'Swap' | 'Limit';
  tradeTypeProps?: TradeTypeProps;
  permanent?: boolean;
  amount?: number;
  decimals?: number;
  amountInWei?: string;
  approveForAddress?: string;
  tokenAddress?: string;
  chainId?: number;
  limitOrderCloseTime?: number;
  limitOrderPrice?: number;
}

export async function createTransactionRaw(provider: any, swapTxObject: SwapTxObjDto, eip1559: boolean) {
  const txParams = {
    data: swapTxObject.data,
    from: swapTxObject.from,
    to: swapTxObject.to,
    chainId: swapTxObject.chainId,
    gasLimit: Web3.utils.toHex(swapTxObject.gas),
    value: Web3.utils.toHex(swapTxObject.value),
    ...(eip1559
      ? {
          maxFeePerGas: Web3.utils.toHex(swapTxObject.maxFeePerGas),
          maxPriorityFeePerGas: Web3.utils.toHex(swapTxObject.maxFeePerGas),
        }
      : { gasPrice: Web3.utils.toHex(swapTxObject.gasPrice) }),
  };
  const signer = provider.getSigner(swapTxObject.from);
  return signer.sendTransaction(txParams);
}

export async function getAllowance(allowanceInfo: Allowance): Promise<number> {
  try {
    const { clientAddress, chainId, token, allowanceTo, decimals } = allowanceInfo;
    const rpcUrl = chains[chainId].rpcUrl;
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    const contract = new web3.eth.Contract(fullCurrencyAbi, token);
    const allowanceInWei = await contract.methods.allowance(clientAddress, allowanceTo)?.call();
    const allowance = Number(convertFromWei(allowanceInWei, decimals));
    return allowance;
  } catch (error) {
    return 0;
  }
}

export async function approveRaw(provider: Web3Provider, tradeInfo: TradeInfo) {
  const { clientAddress, permanent, amountInWei, tokenAddress, approveForAddress, chainId } = tradeInfo;
  const web3 = new Web3(new Web3.providers.HttpProvider(chains[chainId].rpcUrl));
  const contract = new web3.eth.Contract(fullCurrencyAbi, tokenAddress);
  const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1);
  // TODO: check if should include slippage in amountInWei
  const amount = permanent ? UNLIMITED_ALLOWANCE_IN_BASE_UNITS : amountInWei;
  const data = contract.methods.approve(approveForAddress, amount.toString()).encodeABI();
  const gasLimit = await contract.methods
    .approve(approveForAddress, amount.toString())
    .estimateGas({ from: clientAddress });

  const txParams = {
    gasLimit,
    data: data,
    from: clientAddress,
    to: tokenAddress,
    chainId,
  };

  const signer = provider.getSigner(clientAddress);
  return signer.sendTransaction(txParams);
}

export async function signLimitObjRaw(
  obj: LimitObjToSign,
  provider: Web3Provider,
  chainId: number
): Promise<SignedLimitOrder> {
  const supportedProvider = new MetamaskSubprovider(provider.provider as SupportedProvider);

  // TODO: fix this with wallet connect v2
  // wallet connect v2 provider returns from sendAsync a simple string instead of object <{ id, jsonrpc, result }>
  // it is not compatible with other providers
  // this overwrite helps to overcome this issue
  supportedProvider.sendAsync = (payload, cb) => {
    provider.provider.sendAsync(payload, (err, res) => {
      if (typeof res !== 'object') cb(null, { id: payload.id, jsonrpc: payload.jsonrpc, result: res });
      else cb(err, res);
    });
  };

  const addresses = getContractAddressesForChainOrThrow(chainId);

  const order = new LimitOrder({
    ...obj,
    takerAmount: new BigNumber(obj.takerAmount),
    makerAmount: new BigNumber(obj.makerAmount),
    takerTokenFeeAmount: new BigNumber(obj.takerTokenFeeAmount),
    expiry: new BigNumber(obj.expiry),
    chainId: chainId,
    salt: new BigNumber(Date.now().toString()),
    sender: NULL_ADDRESS,
    verifyingContract: addresses.exchangeProxy,
  });
  try {
    const signature = await order.getSignatureWithProviderAsync(supportedProvider, SignatureType.EIP712);

    const orderToFill = {
      ...order,
      signature,
      takerAmount: order.takerAmount.toString(),
      makerAmount: order.makerAmount.toString(),
      takerTokenFeeAmount: order.takerTokenFeeAmount.toString(),
      expiry: order.expiry.toString(),
      salt: order.salt.toString(),
    };
    // used by QA team to copy and execute limit orders
    console.log(JSON.stringify(orderToFill));
    return orderToFill;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function customCancelRaw(provider: Web3Provider, chainId: number, raw: LimitRaw) {
  const {
    maker,
    taker,
    makerAmount,
    takerAmount,
    makerToken,
    takerToken,
    pool,
    salt,
    sender,
    expiry,
    feeRecipient,
    takerTokenFeeAmount,
  } = raw;
  const web3 = new Web3(new Web3.providers.HttpProvider(chains[chainId].rpcUrl));
  const addresses = getContractAddressesForChainOrThrow(chainId);
  const contractAddress = addresses.exchangeProxy;
  const contract = new web3.eth.Contract(ZeroXAbi, contractAddress);
  const data = contract.methods
    .cancelLimitOrder([
      makerToken,
      takerToken,
      makerAmount,
      takerAmount,
      takerTokenFeeAmount,
      maker,
      taker,
      sender,
      feeRecipient,
      pool,
      expiry,
      salt,
    ])
    .encodeABI();

  const txParams = {
    // TODO: replace hardcoded gasLimit
    gasLimit: web3.utils.toHex('100000'),
    value: web3.utils.toHex('0'),
    data: data,
    from: raw.maker,
    to: contractAddress,
    chainId,
  };

  const signer = provider.getSigner(raw.maker);
  return signer.sendTransaction(txParams);
}

export async function getTokenInfo(tokenAddress: string, chainId: number): Promise<Token> {
  if (!Web3.utils.isAddress(tokenAddress)) return null;
  try {
    const rpcUrl = chains[chainId].rpcUrl;
    const ethCallProvider = new Provider(new ethers.providers.JsonRpcProvider(rpcUrl));
    await ethCallProvider.init();

    const contract = new Contract(tokenAddress, fullCurrencyAbi as Fragment[]);

    const calls = [contract.symbol(), contract.name(), contract.decimals()];
    const [symbol, name, decimals] = await ethCallProvider.all(calls);

    return { symbol, name, decimals, address: tokenAddress, logoURI: null };
  } catch (error) {
    return null;
  }
}

export async function getGasPrice(chainId: Chains) {
  const rpcUrl = chains[chainId].rpcUrl;
  const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  return web3.eth.getGasPrice();
}

// TODO: add types for this wrapper, to force it return callback with same type as callback from args
function TooLongWalletRequestWrapper(callback) {
  return async (...args) => {
    let isMounted = false;

    setTimeout(() => {
      if (!isMounted && isMobile) {
        const description = getT('wallet')('reloadPage');
        Notify({ state: NotifyEnum.INFO, message: description });
      }
    }, 45000);

    try {
      const response = await callback(...args);
      if (response) {
        isMounted = true;
        return response;
      }
    } catch (e) {
      isMounted = true;
      console.log('Wallet request error', e);
      throw new Error(e.message);
    }
  };
}

export const approve = TooLongWalletRequestWrapper(approveRaw);
export const createTransaction = TooLongWalletRequestWrapper(createTransactionRaw);
export const signLimitObj = TooLongWalletRequestWrapper(signLimitObjRaw);
export const customCancel = TooLongWalletRequestWrapper(customCancelRaw);
