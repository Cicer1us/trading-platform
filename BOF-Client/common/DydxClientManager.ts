import { ApiKeyCredentials, DydxClient } from '@dydxprotocol/v3-client';
import Web3 from 'web3';
import { Chains } from 'connection/chainConfig';
import { getDydxApiHost } from '@/helpers/leverageTrade/constants';

class DydxClientManager {
  private _client: DydxClient;

  constructor() {
    const chain = Chains.MAINNET;
    this.initDefaultClient(null, chain);
  }

  // TODO: fix this with wallet connect v2
  // wallet connect v2 provider returns from sendAsync a simple string instead of object <{ id, jsonrpc, result }>
  // it is not compatible with other providers
  // this function helps to overcome this issue
  private _getLegacyProvider(provider: any) {
    const legacyProvider = { ...provider };
    legacyProvider.sendAsync = (payload, cb) => {
      provider.sendAsync(payload, (err, res) => {
        if (typeof res !== 'object') cb(null, { id: payload.id, jsonrpc: payload.jsonrpc, result: res });
        else cb(err, res);
      });
    };
    return new Web3(legacyProvider);
  }

  public initDefaultClient(provider: any, chain: Chains) {
    const web3 = this._getLegacyProvider(provider);
    this._client = new DydxClient(getDydxApiHost(chain), {
      apiTimeout: 3000,
      web3: web3 as any,
      networkId: Number(chain),
    });
  }

  public get client() {
    return this._client;
  }

  public set client(client: DydxClient) {
    this._client = client;
  }

  public reInitialize(provider: any, chain: Chains) {
    this.initDefaultClient(provider, chain);
  }

  public provideStarkPrivateKey(starkPrivateKey: string, provider: any, chain: Chains) {
    const web3 = this._getLegacyProvider(provider);
    this._client = new DydxClient(getDydxApiHost(chain), {
      apiTimeout: 3000,
      web3: web3 as any,
      networkId: Number(chain),
      starkPrivateKey,
      apiKeyCredentials: this._client.apiKeyCredentials,
    });
  }

  public provideApiKeyCredentials(apiKeyCredentials: ApiKeyCredentials, provider: any, chain: Chains) {
    const web3 = this._getLegacyProvider(provider);
    this._client = new DydxClient(getDydxApiHost(chain), {
      apiTimeout: 3000,
      web3: web3 as any,
      networkId: Number(chain),
      starkPrivateKey: this._client.starkPrivateKey,
      apiKeyCredentials: apiKeyCredentials,
    });
  }
}

export const clientManager = new DydxClientManager();
