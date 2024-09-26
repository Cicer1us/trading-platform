
## Overview 

1. [How to run TSS Client](#how-to-run-tss-client)
2. [Concept](#concept) 
3. [Connection between TSS-Client and TSS-Server](#the-connection-between-tss-client-and-tss-server)
4. [KeyShareManager](#keysharemanager)
5. [KeyShareAdmin](#keyshareadmin)
6. [Key Generation Protocol](#key-generation-protocol)
7. [Event Sign Protocol](#event-sign-protocol)
8. [ENV file](#env-file)

Consider [TSS-Server](https://github.com/bitoftrade/tss-server) documentation before this one.

## How to run TSS Client 
1. Install `git, docker, docker-compose`. 
2. Clone the repo:
```bash
git clone https://github.com/bitoftrade/tss-client .
```
3. Fill the .env file accordingly to the [ENV file section](#env-file).
4. Run a docker container:
```bash
docker-compose up
```


## Concept 
`TSS-Client` is a part of the TSS protocol which is responsible for:
1. Storing private key share generated in the Key Generation protocol.
2. Use this private key share to sign messages in KeyGen and EventSign protocols. 

_[More detailed explanation](https://github.com/bitoftrade/tss-server#concept)_

## The connection between TSS-Client and TSS-Server  

`TSS-Client` connects automatically to the `TSS-Server` from the start. TSS-Client sings a message and send it to the TSS-Server to get approval for connection. 

Initial ENV variables, namely: `KEY_SHARE_MANAGER_ADDRESS`,`KEY_SHARE_MANAGER_CHAIN_ID`,`ADMIN_GNOSIS_SAFE_ADDRESS`,`ADMIN_GNOSIS_SAFE_CHAIN_ID` must be the same as on the `TSS-Server`, otherwise `TSS-Server` will reject the connection.
Also, `AVAILABLE_CHAINS` must contain all chains that `TSS-Server` supports.  

## KeyShareManager 

KeyShareManager smart contract is responsible for authorization between TSS-Server and TSS-Client. Each TSS-Client has its own `KeyShareAdmin` and `KeyShareHolder`. 

`KeyShareHolder` signs the connection message.The private key of `KeyShareHolder` is stored in the .env file. 
`KeyShareAdmin` can update `KeyShareHolder`'s private key.

_[More detailed explanation](https://github.com/bitoftrade/tss-server#keysharemanager)_

## KeyShareAdmin 
`KeyShareAdmin` can directly interact with TSS-Client via signed messages.

`KeyShareAdmin` is able to: 
1. Disconnect TSS-Client from TSS-Server by a signing stringified message with the following type:
```bash
{
  expiryTime: 12345678,
  type: "disconnect_tss_client"
}
```
_endpoint_: `/disconnect`

2. Connect back TSS-Client to TSS-Server by signing the stringified message with the following type:
```bash
{
  expiryTime: 12345678,
  type: "connect_tss_client"
}
```
_endpoint_: `/connect`

3. Update KeyShareHolder private key by signing the stringified message with the following type:
```bash
{
  expiryTime: 12345678,
  type: "update_key_share_holder",
  prKey: "0x000000000000000000000000000000000000000000000000000000000000000000"
}
```
_endpoint_: `/update-key-share-holder`

Private key update doesn't disconnect `TSS-Client` from `TSS-Server`. It'll be used in future connections to sign auth messages. 

After `KeyShareAdmin` signed the message, to execute send a POST request on the endpoint to execute with following type: 
```bash
{
  "message": "{\"expiryTime\":12345678,\"type\":\"connect_tss_client\"}",
  "signature": "0x000000000000000000000000000000000000000000000000000000000000000000"
}
```
Where `signature` made by `KeyShareAdmin` by signing `message`. 

## Key Generation Protocol

Every `TSS-Client` participates in the Key Gen protocol. Before the protocol starts, each `TSS-Client` checks if `keyGenMessage` was signed by `ADMIN_GNOSIS_SAFE_ADDRESS`. If the message wasn't signed by Gnosis Safe Admin, the Key Generation protocol will be interrupted.      
After the Key Gen protocol, each `TSS-Client` receives unique private share of the new `signer` address.

All private key shares will be stored in the `tss-key-shares` folder.

_[More detailed explanation](https://github.com/bitoftrade/tss-server#key-generation-protocol)_

## Event Sign Protocol

In this protocol, `TSS-Client`s sign a specific event message.  
Before the protocol starts, each `TSS-Client` checks whether the event satisfies the next requirements:

1. Transaction must exist, be on the supported chain and be successful.
2. Transaction must be completed `N`-th block ago.  
3. Transaction must have an event from the ABI.  

If there are not enough `TSS-Clients` (less than `t+1`) that approve the event for signing, the protocol will be interrupted. 

_[More detailed explanation](https://github.com/bitoftrade/tss-server#event-sign-protocol)_

## ENV file 

***All env variables, except `PORT, KEY_SHARE_HOLDER_PRIVATE_KEY, KEY_SHARE_ADMIN`, are provider by the TSS Admin.***

Available chains for TSS protocol. TSS-Client must support all TSS-Server chains.
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
Server URL is the server connection URL via WebSocket.
```bash
SERVER_URL=""
```

Each TSS process runs on a different port on the TSS-Server. Base URL is used to create connection URL: `${env.SM_MANAGER_BASE_URL}:${port}`. In the current version, `SM_MANAGER_BASE_URL` is just the `SERVER_URL` without a port.
```bash
SM_MANAGER_BASE_URL=""
```

KeyShareAdmin address is the admin address of the current KeyShareHolder. This address is unique for every TSS-Client. 
```bash
KEY_SHARE_ADMIN=""
```

KeyShareHolder private key. This private key is used to sign authorized messages. 
```bash
KEY_SHARE_HOLDER_PRIVATE_KEY=""
```

Address and chainId of KeyShareManager smart contract which is used to handle authorization between TSS-Server and TSS-Client. 
```bash
KEY_SHARE_MANAGER_ADDRESS="0x0000000000000000000000000000000000000000"
KEY_SHARE_MANAGER_CHAIN_ID=5
```

Address and chainId of gnosis safe admin wallet which must sign the message to start KeyGen protocol.
```bash
ADMIN_GNOSIS_SAFE_ADDRESS="0x0000000000000000000000000000000000000000"
ADMIN_GNOSIS_SAFE_CHAIN_ID=5
```

By default, TSS Client makes an attempt to connect to the TSS Server from the start. It could changed, if set AUTO_CONNECT to `false`, _therefore TSS Client will be possible to connect only via `/connect` endpoint by KeyShareAdmin. (optional)_.  
```bash
AUTO_CONNECT=false
```

Npm token required for private TSS npm packages. _(Provided by the TSS Admin)_
```bash
NPM_TOKEN=npm_token
```

Port on which server will be started.
```bash
PORT=4000
```

See *.env.example* to check the full list of env variables.
