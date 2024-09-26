import { Resolvers } from '../../.graphclient';
import { Chain } from './constants';

const graphChainNames: Record<number, string> = {
  // temporary graph name
  [Chain.POLYGON]: 'cross-chain-swaps-polygon',
  [Chain.BSC]: 'cross-chain-swaps-bsc',
  [Chain.MAINNET]: 'crypto-payment-mainnet',
};

export const resolvers: Resolvers = {
  Query: {
    crossPayments: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.payment.Query.payments({
            root,
            args: { ...args, where: { orderId_in: args.orderId_in } },
            context: {
              ...context,
              // unknown bug from graphclient, which disables to pass context variables
              // eslint-disable-next-line
              // @ts-ignore
              chainName: graphChainNames[chainId],
            },
            info,
          }).then((payments) =>
            payments.map((payment) => ({ ...payment, chainId })),
          ),
        ),
      ).then((payments) => payments.flat()),
  },
};
