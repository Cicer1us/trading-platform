## Overview 

1. [How to run TSS](#how-to-run-tss)
2. [Concept](#concept)
3. [KeyShareManager](#keysharemanager)
4. [Steps to connect TSS-Client to TSS-Server](#steps-to-connect-tss-client-to-tss-server)
5. [SignerService Compatibility](#signerservice-compatibility)
6. [Key Generation protocol](#key-generation-protocol)
7. [Event Sign protocol](#event-sign-protocol)
8. [ENV file](#env-file)
9. [Hardware requirements](#hardware-requirements)

## How to run TSS  

1. Create Gnosis Safe smart wallet for signing messages required in key generation protocol.
2. Deploy KeyShareManager smart contract.
3. Set KeyShareAdmins in KeyShareManager smart contract. 
4. Each KeyShareAdmin needs to set their own KeyShareHolder address in KeyShareManager.
5. For each TSS-Client add KeyShareHolder's private key in your *.env* file.
6. Run TSS-Client, it will connect to TSS-Server automatically.

## Concept 
The main idea of this project is to automate the protocol of distributed key generation and signing between several participants. Such an approach can provide numerous benefits, especially in terms of security - ([see threshold signatures explained](https://academy.binance.com/en/articles/threshold-signatures-explained)). 

Under the hood, protocol uses a Rust implementation of `{t,n}-threshold ECDSA` developed and maintained by [ZenGo-X](https://github.com/ZenGo-X/multi-party-ecdsa). In this protocol `n` is the amount of TSS-Clients and `t+1` is the minimal amount of participated TSS-Clients needed to generate signatures. 

As a result of key generation protocol each TSS-Client has an independent and unique key share that can be used in signature generation. 

Communication between TSS-Server and TSS-Clients is based on WebSocket. To understand who and how TSS-Clients can connect to  TSS-Server look at the [KeyShareManager](#keysharemanager) section. 

## KeyShareManager

KeyShareManager is a smart contract responsible for participants in the `KeyGen` and `EventSign` protocols. Only *authorized* TSS-Clients can connect. 

KeyShareManager handles relations between two entities: 
1. KeyShareHolder
2. KeyShareAdmin

KeyShareHolder:
1. TSS-Client can connect to TSS-Serer only via signed message by KeyShareHolder.
2. KeyShareHolder is an EAO (Externally Owned Account).
3. KeyShareHolder address is managed by KeyShareAdmin.  

KeyShareAdmin:
1. KeyShareAdmin is unique for every KeyShareHolder. 
2. KeyShareAdmin addresses in managed KeyShareManager's owner. 
3. Only KeyShareAdmin can update his own KeyShareHolder address.  
4. KeyShareAdmin can update the KeyShareHolder's private key on TSS-Client via a signed message and can manually connect/disconnect TSS-Client.

If KeyShareHolder's private key was compromised or hijacked, KeyShareAdmin can update the KeyShareHolder address in the smart contract. Then via a signed message dynamically set a new KeyShareHolder's private key in TSS-Client API.   

## Steps to connect TSS-Client to TSS-Server:

1. Deploy  KeyShareManager smart contract.
2. The Owner of the KeyShareManager sets an array of KeyShareAdmin addresses.
3. Each KeyShareAdmin independently set its own KeyShareHolder address in KeyShareManager smart contract.
4. KeyShareHolder's private key is used on TSS-Client to sign messages and connect to the TSS-Server. 

## SignerService compatibility  

`Signer Service` uses different `Signers` to sign events and to do `cross check` between them. It requires for all `Signers` to implement same `Signer Interface`. 

`Signer Interface` has 2 endpoints.

_1. endpoint_: `GET /metadata`

This endpoint must return JSON object with following type:
```bash
{
  "name": signerName,
  "availableChains": availableChains,
  "signer": signerAddress 
}
```
Where `signerName` is the client-recognizable name of the signer, `availableChains` is the list of supported chains. `signer` is the address which is used to sign messages.

_2. endpoint_: `POST /sign-event`

Endpoint request body and response described [here](#event-sign-protocol).

`TSS-Server` implements `Signer Interface`. It means that `TSS-Server` could be used in SignerService like public signer as well as any other signers.
## Signer address

KeyShareManager is also responsible for managing the current signer address stored in the variable `signer`.Before signing each TSS-Client must understand which key share to use in the signing process. They will get this address from the `signer` field. Only the KeyShareManager owner can update this variable by the new signer address.   


## Key Generation protocol 

To initiate specific protocols, like key generation one, gnosis safe admin wallet need to sign stringified JSON object with specific fields. `KeyGenMessage` message looks like: 
```bash
{
   "type": "key_gen",
   "threshold": 1,
   "parties": 2
}
```

To sign any message via Gnosis Safe it's necessary to use [SignMessageLib](https://github.com/safe-global/safe-contracts/blob/main/contracts/libraries/SignMessageLib.sol). It's also available in [SafeAppsSDK](https://github.com/safe-global/safe-apps-sdk/blob/master/packages/safe-apps-sdk/src/txs/index.ts#L35). 

Each message signing will generate transaction.

To start Key Generation send `POST` request to `/start-key-gen` with this body: 
```bash  
{
  "message": "{\"type\":\"key_gen\",\"threshold\":1,\"parties\":2}",
  "txHash": "0x0615eacbe66c7547142654509c136119c7a6432b6405264901496fa47009e35e"
}
```  
Where `message` is stringified JSON with escaped double quotes, `txHash` is hash from the signing transaction.

To start the Key Gen Protocol the signed message must correspond to these requirements:
1. The message must be signed by a Gnosis Safe Admin. 
2. The signed message must be a stringified JSON with `KeyGenMessage` params.  
3. `parties` param must be not less than `2`,and the `threshold` param must be not less than `1`. 
4. Every TSS-Client with corresponding KeyShareHolder params must be connected to TSS-Server.
5. Every signed message can be handled only once. Therefore `txHash` must not be used before. 

If the message was successfully validated, the Key Generation protocol will be initiated. As a result of this request new key shares will be generated on each TSS-Client and the response will be:
```bash
{
  "address": "0xd55058dc217c4fe25ba6b9d5394c0a9aee73944a"
}
```   
Where the `address` is the newly generated address with distributed key shares.  


### How to use generated address?  

As described in the [KeyShareManager](#keysharemanager) section, TSS-Clients use the `signer` field to get signer address to determine which key to use in the signing process. Therefore, to use the newly generated `signer` address, the KeyShareManager owner must set address, returned after the KeyGen protocol, in the smart contract. 

## Event Sign protocol 

The main feature of this TSS-Server is giving approval for specific events with specific parameters. TSS-Server with TSS-Clients generate the signature of the event as approval. Therefore, other third-parties can verify the signature generated by the `signer` and be sure that this event did exist.   


To start the `Event Sign` protocol send a `POST` request to `/sign-event` with the following body: 
```bash  
{
  "chainId": 1,
  "txHash": "0x0615eacbe66c7547142654509c136119c7a6432b6405264901496fa47009e35e",
  "abi": {
    "name": "string",
    "type": "string",
    "anonymous": true,
    "inputs": [
      {
        "name": "string",
        "type": "string",
        "indexed": true
      }
    ]
  },
  "eventLogIndex": 1
}
```  
Any transaction can contain events. Event Sign protocol is used to verify if `event` really existed in specific transaction. 
In this request, `chainId` and `txHash` are from the transaction that has the `event`,
`abi` is the [ABI](https://docs.soliditylang.org/en/develop/abi-spec.html) of the `event`.

By default, the TSS server will pick the first event that corresponds to the ABI. `eventLogIndex` is an optional parameter, that specifies logIndex for the selected event. _Could be used to distinguish events with the same ABI(signature)._


Transaction that has the `event` must correspond to these requirements:
1. Transaction must exist, be on the supported chain and be successful.
2. Transaction must be completed `N`-th block ago.  
3. Transaction must have an event from the ABI.  


The transaction can be recognized as confirmed if it was completed `N`-th block ago. This `N` differs for every chain. Currently, the supported chains are:
```bash  
{
  MAINNET: 6,
  OPTIMISM: 14, 
  BSC: 6,
  POLYGON: 55,
  ARBITRUM: 6, 
  AVALANCHE: 1,
  FANTOM: 1,
  GOERLI: 6,
}
```


### Event Message  

To create an event signature TSS-Clients sign specific `message`. This `message` is the hash of the `eventId` and `eventArgs`: `keccak256(eventId,eventArgs)`.  

`EventId` is the event params that together create unique id.

```bash
EventId = EventName + EventChainId + EventContract + EventTransactionHash
```

`EventName` - the name of the event
`EventChainId` - chainId of the transaction with invoked event
`EventContract` - a contract which invoked the event   
`EventTransactionHash` - hash of the transaction with invoked event

`EventArgs` is the event's arguments. All event arguments will be combined together in the same order as they have been in the event.


```bash
EventArgs = EventArg_1 + EventArg_2 + ... 
```

For example, for [this](https://etherscan.io/tx/0xa3b1123b8181f27c30f9cae42340325f0fcecf80c7886045dc159a8b8abd9a63#eventlog) `Transfer` event `message` would be:
```bash
message=keccak256(
    "Transfer",
    1,
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0xa3b1123b8181f27c30f9cae42340325f0fcecf80c7886045dc159a8b8abd9a63",
    "0x974CaA59e49682CdA0AD2bbe82983419A2ECC400",
    "0x59169f3c0e9e3630D0EBa5E5561dC1677D9451F3",
    "1574766820"
    )="0x9d4776df88b0ab9bc77fdd2170fc62ce668886290c49b5306bb003d0a751bdc1"
```

### Event Signature  

If an event was successfully validated, Event Sign protocol will be initiated. As a result of this request a new signature will be generated and the response will be:
```bash
{
  "chainId": 1,
  "txHash": "0xa3b1123b8181f27c30f9cae42340325f0fcecf80c7886045dc159a8b8abd9a63",
  "eventHash": "0x9d4776df88b0ab9bc77fdd2170fc62ce668886290c49b5306bb003d0a751bdc1",
  "signature": "0xd189b3df1b889c280f4dc84de5aaaf9aaf425838752ff3ceb13234aae17d12f46375420d93181968ce03d02a5069c2d848a2512113d24004db9001ff889d9fa21c",
  "signer": "0x50fde2a03a1edfd7e1fddeda73d6620a1d0beee3",
  "params": [
    "Transfer",
    1,
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0xa3b1123b8181f27c30f9cae42340325f0fcecf80c7886045dc159a8b8abd9a63",
    "0x974CaA59e49682CdA0AD2bbe82983419A2ECC400",
    "0x59169f3c0e9e3630D0EBa5E5561dC1677D9451F3",
    "1574766820"
  ]
}
```   
Where `signature` is signed `message` by TSS-Clients.  


## ENV file

Available chains for TSS protocol. 
_(Current version supports only EVM compatible chains)_
```bash
AVAILABLE_CHAINS=[1,5,56]
```

For each available chain there must be a RPC URL. 
```bash
# RPC_URL_<chain_id>=
RPC_URL_1=""
RPC_URL_5=""
RPC_URL_56=""
```

Several `EventSign` or `KeyGen` protocols can be run at the same time. Each process automatically runs on an independent port. The amount of simultaneous processes is equal to the number of GG20_AVAILABLE_PORTS.
```bash
GG20_AVAILABLE_PORTS=[8001, 8002, 8003]
```

Address and chainId of the KeyShareManager smart contract which is used to handle authorization between TSS-Server and TSS-Client. 
```bash
KEY_SHARE_MANAGER_ADDRESS="0x0000000000000000000000000000000000000000"
KEY_SHARE_MANAGER_CHAIN_ID=5
```

Address and chainId of gnosis safe admin wallet which must sign the message to start KeyGen protocol.
```bash
ADMIN_GNOSIS_SAFE_ADDRESS="0x0000000000000000000000000000000000000000"
ADMIN_GNOSIS_SAFE_CHAIN_ID=5
```

Name of the signer, which is required by the `Signer interface`.
```bash
SIGNER_NAME="btf"
```
Npm token required for private TSS npm packages. 
```bash
NPM_TOKEN=npm_token
```

Port on which server will be started.
```bash
PORT=4000
```

See *.env.example* to check the full list of env variables.

# Hardware requirements:

```
1. CPU: ??
2. Memory: ??
```
git clone https://github.com/bitoftrade/tss-client . && npm ci && ./build.sh && npm run build  