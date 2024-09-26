import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { clientManager } from '@/common/DydxClientManager';
import { RequestMethod } from '@dydxprotocol/v3-client/build/src/lib/axios';
import { setAccount, setDydxDataToInitial, setLastTrade, setMarkets } from '@/redux/dydxDataSlice';
import { useWeb3React } from '@web3-react/core';
import createLeverageTrade from 'API/leverageTrade/createLeverageTrade';
import { setDydxAuthToInitial } from '@/redux/dydxAuthSlice';
import { getDydxWsHost } from '@/helpers/leverageTrade/constants';
import { setLeverageOrderError } from '@/redux/leverageSlice';
import { Chains } from '../connection/chainConfig';

export interface SocketProviderProps {
  children: React.ReactNode;
}

enum Channel {
  Markets = 'v3_markets',
  Trades = 'v3_trades',
  OrderBook = 'v3_orderbook',
  Accounts = 'v3_accounts',
}

const DydxSocketProvider: React.FC = () => {
  const { connector, account: clientAddress } = useWeb3React();
  const { chainId, account } = useWeb3React();
  const dispatch = useAppDispatch();
  const selectedMarket = useAppSelector(({ leverage }) => leverage?.selectedMarket);
  const currentMarket = `${selectedMarket}-USD`;
  const isAuthorized = useAppSelector(({ dydxAuth }) => dydxAuth.authIsCompleted);
  const apiKeyCredentials = useAppSelector(({ dydxAuth }) => dydxAuth.apiKeyCredentials);
  const [wsConnection, setWsConnection] = useState<WebSocket>(null);

  /**
   * useEffects
   */
  useEffect(() => {
    dispatch(setDydxAuthToInitial());
    dispatch(setDydxDataToInitial());
    dispatch(setLeverageOrderError(null));
  }, [connector, chainId, account]);

  useEffect(() => {
    const ws = new WebSocket(getDydxWsHost(chainId));

    ws.addEventListener('open', onOpen);
    ws.addEventListener('message', onMessage);
    ws.onerror = error => {
      console.error('dydxSocketConnection', error);
    };

    setWsConnection(ws);
    return () => {
      ws.removeEventListener('open', onOpen);
      ws.removeEventListener('message', onMessage);
    };
  }, [isAuthorized, connector]);

  useEffect(() => {
    if (wsConnection?.readyState === 1) {
      wsConnection.send(
        JSON.stringify({
          type: 'subscribe',
          channel: Channel.Trades,
          id: currentMarket,
        })
      );
    }
  }, [currentMarket]);

  /**
   * Event handlers
   */
  function onOpen(this: WebSocket) {
    createSubscription(this, Channel.Markets);
    createSubscription(this, Channel.OrderBook, { id: currentMarket });
    createSubscription(this, Channel.Trades, { id: currentMarket });

    if (isAuthorized) {
      const timestamp = new Date().toISOString();
      const signature = getSignature(timestamp);
      const msg = getAccountSubscriptionTimeMessage(signature, timestamp);

      createSubscription(this, Channel.Accounts, msg);
    }
  }

  function onMessage(this: WebSocket, ev: MessageEvent<any>) {
    const res = JSON.parse(ev.data);

    switch (res?.channel) {
      case Channel.Markets:
        dispatch(setMarkets(res.contents));
        break;
      case Channel.Trades:
        dispatch(setLastTrade({ market: res?.id, trade: res.contents.trades[0] }));
        break;
      case Channel.Accounts:
        manageAccountChannelResponseContents(res.contents);
    }
  }

  /**
   * Helpers
   */
  const createSubscription = (ws: WebSocket, channel: Channel, params?: Record<string, string>) => {
    ws.send(
      JSON.stringify({
        type: 'subscribe',
        channel: channel,
        ...params,
      })
    );
  };

  const getSignature = (timestamp: string) => {
    return clientManager.client.private.sign({
      requestPath: '/ws/accounts',
      method: RequestMethod.GET,
      isoTimestamp: timestamp,
    });
  };

  const getAccountSubscriptionTimeMessage = (signature: string, timestamp: string) => {
    return {
      accountNumber: '0',
      apiKey: apiKeyCredentials.key,
      signature,
      timestamp,
      passphrase: apiKeyCredentials.passphrase,
    };
  };

  const manageAccountChannelResponseContents = contents => {
    dispatch(setAccount(contents));
    if (chainId === Chains.MAINNET && contents?.fills) {
      contents?.fills.forEach(fill => {
        createLeverageTrade(fill, clientAddress).then();
      });
    }
  };

  return <></>;
};

export default DydxSocketProvider;
