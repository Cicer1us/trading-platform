import getNetworkName from '@/helpers/getNetworkName';
import TagManager from 'react-gtm-module';
import { CHAIN_TO_NAME } from '../connection/chainConfig';

export const analytics = (eventName: string, error = null, hash = null, analyticsData) => {
  if (analyticsData === null) {
    analyticsData = { event_properties: {} };
  }
  const additional_event_properties: any = {};
  const { transaction_type, swap_token_pair, limit_token_pay, limit_token_receive } = analyticsData.event_properties;
  if (error) {
    additional_event_properties.transaction_error = error.message;
  }

  if (hash) {
    additional_event_properties.transaction_hash = hash;
  }

  let label = '';

  switch (transaction_type) {
    case 'Swap':
      label = swap_token_pair;
      break;

    case 'Limit':
      label = `${limit_token_pay}/${limit_token_receive}`;
      break;

    case 'Leverage':
      label = 'USDC';
      break;

    default:
      break;
  }

  const tagManagerArgsCE = {
    gtmId: process.env.NEXT_PUBLIC_GA_ID,
    dataLayer: {
      event: eventName,
      event_properties: { ...analyticsData.event_properties, ...additional_event_properties },
      wallet_properties: { wallet_id: analyticsData.clientAddress },
      ga_event: {
        category: analyticsData.event_properties.transaction_type,
        label: label,
      },
    },
  };
  TagManager.dataLayer(tagManagerArgsCE);
};

export const getLimitAnalyticsData = ({ type, clientAddress, tokenA, tokenB, chainId }) => {
  const network = getNetworkName(chainId);

  return {
    event_properties: {
      transaction_type: type,
      transaction_blockchain: CHAIN_TO_NAME[chainId].name,
      transaction_blockchain_network: network,
      limit_token_pay: tokenA,
      limit_token_receive: tokenB,
    },
    clientAddress,
  };
};

export const analyticsSwapSubmit = (
  tokenA: string,
  tokenB: string,
  clientAddress: string,
  side: string,
  chainId: number
) => {
  const options = {
    type: 'Swap',
    clientAddress,
    tokenA,
    tokenB,
    direction: side,
    chainId,
  };

  const analyticsData = getSwapAnalyticsData(options);

  analytics('CE swap_form_submit', null, null, analyticsData);
};

export const analyticsLimitSubmit = (tokenA: string, tokenB: string, clientAddress: string, chainId: number) => {
  const options = { type: 'Limit', clientAddress, tokenA: tokenA, tokenB: tokenB, chainId };
  const analyticsData = getLimitAnalyticsData(options);
  analytics('CE limit_form_submit', null, null, analyticsData);
};

export const getSwapAnalyticsData = ({ clientAddress, tokenA, tokenB, direction, chainId }) => {
  const network = getNetworkName(chainId);

  return {
    event_properties: {
      transaction_type: 'Swap',
      transaction_blockchain: 'ethereum',
      transaction_blockchain_network: network,
      swap_token_pair: `${tokenA}/${tokenB}`,
      swap_from_token: tokenA,
      swap_to_token: tokenB,
      swap_direction: direction,
    },
    clientAddress,
  };
};

export const getLeverageAnalyticsData = ({ propsType, type, clientAddress, positionToken, direction, chainId }) => {
  const network = getNetworkName(chainId);

  if (propsType === 'transaction') {
    return {
      event_properties: {
        transaction_type: type,
        transaction_blockchain: CHAIN_TO_NAME[chainId].name,
        transaction_blockchain_network: network,
      },
      clientAddress,
    };
  }

  return {
    event_properties: {
      transaction_type: type,
      transaction_blockchain: CHAIN_TO_NAME[chainId].name,
      transaction_blockchain_network: network,
      leverage_position_token: positionToken,
      leverage_position_direction: direction,
    },
    clientAddress,
  };
};

export const getTokensUnlockAnalyticsData = ({ type, clientAddress, props, chainId }) => {
  const network = getNetworkName(chainId);
  let actions = {};

  switch (type) {
    case 'Swap':
      actions = {
        swap_token_pair: `${props.tokenA}/${props.tokenB}`,
        swap_from_token: props.tokenA,
        swap_to_token: props.tokenB,
        swap_direction: props.direction,
      };
      break;
    case 'Limit':
      actions = {
        limit_token_pay: props.tokenA,
        limit_token_receive: props.tokenB,
      };
      break;
    case 'Leverage':
      actions = {
        leverage_position_token: props.positionToken,
        leverage_position_direction: props.direction,
      };
    default:
      break;
  }

  return {
    event_properties: {
      ...actions,
      transaction_type: type,
      transaction_blockchain: CHAIN_TO_NAME[chainId].name,
      transaction_blockchain_network: network,
    },
    clientAddress,
  };
};
