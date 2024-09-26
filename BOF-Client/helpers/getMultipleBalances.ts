import { Token } from '@/interfaces/Tokens.interface';
import { chains } from 'connection/chainConfig';
import Web3 from 'web3';
import { initUtils } from '@bitoftrade/bof-utils';
import { Chain } from '@bitoftrade/bof-utils/dist/cjs/types';

const web3Providers = Object.keys(chains).reduce((total, chain) => {
  total[chain] = new Web3(chains[chain].rpcUrl);
  return total;
}, {}) as Record<Chain, Web3>;

const { getMultipleBalances: getBalances, getMultipleAllowanceAmount: getAllowance } = initUtils(web3Providers);

export async function getMultipleBalances(
  clientAddress: string,
  tokens: Token[],
  chainId: number
): Promise<Record<string, number>> {
  const web3Provider = web3Providers[chainId];
  const nativeToken = chains[chainId].nativeToken.address;
  try {
    const balances = await getBalances(clientAddress, chainId, tokens);
    const nativeBalance = await web3Provider.eth.getBalance(clientAddress);
    balances[nativeToken] = web3Provider.utils.fromWei(nativeBalance);
    return Object.keys(balances).reduce(
      (acc, token) => ({
        ...acc,
        [token]: Number(balances[token]),
      }),
      {}
    );
  } catch (e) {
    return {};
  }
}

export async function getMultipleAllowance(
  clientAddress: string,
  tokens: Token[],
  chainId: number,
  allowanceAddress: string
): Promise<Record<string, number>> {
  try {
    const allowance: Record<string, string> = await getAllowance(clientAddress, chainId, tokens, allowanceAddress);

    return Object.keys(allowance).reduce(
      (acc, token) => ({
        ...acc,
        [token]: Number(allowance[token]),
      }),
      {}
    );
  } catch (e) {
    return {};
  }
}

export async function getMultiChainMultipleAllowance(
  clientAddress: string,
  tokens: Record<number, Token[]>,
  allowanceAddress: Record<number, string>
): Promise<Record<number, Record<string, number>>> {
  try {
    const allowancesRequests = [];
    const chains = [];

    for (const chain of Object.keys(tokens)) {
      allowancesRequests.push(
        getMultipleAllowance(clientAddress, tokens[chain], Number(chain), allowanceAddress[chain])
      );
      chains.push(chain);
    }

    const allowances = await Promise.all(allowancesRequests);
    const multiChainallowances = {};

    for (let i = 0; i < chains.length; i++) {
      multiChainallowances[chains[i]] = allowances[i];
    }

    return multiChainallowances;
  } catch (e) {
    const allowances = {};
    for (const chain of Object.keys(tokens)) {
      allowances[chain] = {};
    }
    return allowances;
  }
}

export async function getMultiChainMultipleBalances(
  clientAddress: string,
  tokens: Record<number, Token[]>
): Promise<Record<number, Record<string, number>>> {
  try {
    const balancesRequests = [];
    const chains = [];

    for (const chain of Object.keys(tokens)) {
      balancesRequests.push(getMultipleBalances(clientAddress, tokens[chain], Number(chain)));
      chains.push(chain);
    }

    const balances = await Promise.all(balancesRequests);
    const multiChainBalances = {};

    for (let i = 0; i < chains.length; i++) {
      multiChainBalances[chains[i]] = balances[i];
    }

    return multiChainBalances;
  } catch (e) {
    const balances = {};
    for (const chain of Object.keys(tokens)) {
      balances[chain] = {};
    }
    return balances;
  }
}
