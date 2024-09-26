import { MULTI_CALL_ADDRESS } from './addresses';
import { Allowance, Chain, ExchangeAddress, Token, TradeInfo } from './types';
import erc20Abi from './abi/ERC20.json';
import multiCallAbi from './abi/Mutlicall.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { formatUnits, parseUnits } from '@ethersproject/units';

const UNLIMITED_ALLOWANCE_IN_BASE_UNITS =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

type Web3Providers = Partial<Record<Chain, Web3>>;

const MinNFTAbi = [
  {
    constant: false,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as AbiItem[];

export function initUtils(web3Providers: Web3Providers) {
  const erc20 = new web3Providers[Chain.MAINNET].eth.Contract(erc20Abi as AbiItem[]);
  const nftContract = new web3Providers[Chain.MAINNET].eth.Contract(MinNFTAbi);

  async function sendCalls(web3: Web3, chainId: Chain, calls: [string, string][]) {
    const multiCallAddress = MULTI_CALL_ADDRESS[chainId];
    if (!web3Providers[chainId] || !multiCallAddress) throw new Error('Invalid chain id');

    try {
      const multiCall = new web3.eth.Contract(multiCallAbi as AbiItem[], multiCallAddress);

      return multiCall.methods.tryAggregate(false, calls).call();
    } catch (e) {
      console.error(e.message);
      return {};
    }
  }

  function decodeResponseAndGroupByTokenAddress(
    response,
    web3: Web3,
    tokens: Token[],
    type: string
  ): Record<string, string | null> {
    const groupedResponse: Record<string, string | null> = {};

    response.forEach(({ returnData, success }, index) => {
      const token = tokens[index];

      if (!success) {
        groupedResponse[token.address] = null;
      } else if (returnData === '0x') {
        groupedResponse[token.address] = '0';
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // incompatibility between web3-eth-abi and types
        // decodeParameter return string, not object
        const balanceInWei: string = web3.eth.abi.decodeParameter(type, returnData);
        groupedResponse[token.address.toLowerCase()] = formatUnits(balanceInWei, token.decimals);
      }
    });
    return groupedResponse;
  }

  async function getMultipleBalances(
    userAddress: string,
    chainId: Chain,
    tokens: Token[]
  ): Promise<Record<string, string | null>> {
    const web3: Web3 = web3Providers[chainId];
    const balanceOfCall = erc20.methods.balanceOf(userAddress).encodeABI();
    const calls: [string, string][] = tokens.map((token) => [token.address, balanceOfCall]);

    const balancesResponse = await sendCalls(web3, chainId, calls);
    return decodeResponseAndGroupByTokenAddress(balancesResponse, web3, tokens, 'uint256');
  }

  async function getMultipleAllowanceAmount(
    userAddress: string,
    chainId: Chain,
    tokens: Token[],
    allowanceAddress?: string
  ): Promise<Record<string, string | null>> {
    const web3: Web3 = web3Providers[chainId];
    const allowanceCall = erc20.methods
      .allowance(userAddress, allowanceAddress ?? ExchangeAddress.PARASWAP)
      .encodeABI();
    const calls: [string, string][] = tokens.map((token) => [token.address, allowanceCall]);

    const allowancesResponse = await sendCalls(web3, chainId, calls);
    return decodeResponseAndGroupByTokenAddress(allowancesResponse, web3, tokens, 'uint256');
  }

  function groupNftAllowanceData(response, web3: Web3, nftAddresses: string[], type: string) {
    const groupedResponse: { [key: string]: string } = {};

    response.forEach(({ returnData }, index) => {
      const address = nftAddresses[index];
      groupedResponse[address] = String(web3.eth.abi.decodeParameter(type, returnData));
    });
    return groupedResponse;
  }

  async function getMultipleNftAllowance(
    userAddress: string,
    chainId: Chain.MAINNET | Chain.POLYGON,
    addresses: string[]
  ): Promise<Record<string, string>> {
    const web3: Web3 = web3Providers[chainId];

    const exchangeAddress =
      chainId === Chain.MAINNET
        ? ExchangeAddress.PARASWAP_NFT_ETHEREUM
        : ExchangeAddress.PARASWAP_NFT_POLYGON;

    const call = nftContract.methods.isApprovedForAll(userAddress, exchangeAddress).encodeABI();
    const calls: [string, string][] = addresses.map((address) => [address, call]);

    const allowancesResponse = await sendCalls(web3, chainId, calls);
    return groupNftAllowanceData(allowancesResponse, web3, addresses, 'uint256');
  }

  async function getAllowanceAmount(allowanceInfo: Allowance, rpcUrl: string): Promise<string> {
    try {
      const { clientAddress, token } = allowanceInfo;
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
      const contract = new web3.eth.Contract(erc20Abi as AbiItem[], token);
      return contract.methods.allowance(clientAddress, ExchangeAddress.PARASWAP)?.call();
    } catch (e) {
      return '0';
    }
  }

  async function requestApprove(library: any, tradeInfo: TradeInfo) {
    const { clientAddress, tokenAddress, chainId, amount } = tradeInfo;

    const web3: Web3 = web3Providers[chainId];
    const contract = new web3.eth.Contract(erc20Abi as AbiItem[], tokenAddress);

    let allowanceAmount;
    if (amount) {
      allowanceAmount = parseUnits(amount, tradeInfo?.decimals).toString();
    } else {
      allowanceAmount = UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
    }

    const data = contract.methods.approve(ExchangeAddress.PARASWAP, allowanceAmount).encodeABI();

    const txParams = {
      gasLimit: web3.utils.toHex('100000'),
      value: web3.utils.toHex('0'),
      data: data,
      from: clientAddress,
      to: tokenAddress,
      chainId,
    };

    const signer = library.getSigner(clientAddress);
    return signer.sendTransaction(txParams);
  }

  return {
    getMultipleBalances,
    getMultipleAllowanceAmount,
    getMultipleNftAllowance,
    getAllowanceAmount,
    requestApprove,
  };
}
