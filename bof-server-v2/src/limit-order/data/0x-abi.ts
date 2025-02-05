import { AbiItem } from 'web3-utils'

const abi: AbiItem[] = [
	{
		anonymous: false,
		inputs: [
			{
				name: 'orderHash',
				type: 'bytes32',
				indexed: false
			},
			{
				name: 'maker',
				type: 'address',
				indexed: false
			},
			{
				name: 'taker',
				type: 'address',
				indexed: false
			},
			{
				name: 'feeRecipient',
				type: 'address',
				indexed: false
			},
			{
				name: 'makerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'takerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128',
				indexed: false
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128',
				indexed: false
			},
			{
				name: 'takerTokenFeeFilledAmount',
				type: 'uint128',
				indexed: false
			},
			{
				name: 'protocolFeePaid',
				type: 'uint256',
				indexed: false
			},
			{
				name: 'pool',
				type: 'bytes32',
				indexed: false
			}
		],
		name: 'LimitOrderFilled',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'inputToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'outputToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'inputTokenAmount',
				type: 'uint256',
				indexed: false
			},
			{
				name: 'outputTokenAmount',
				type: 'uint256',
				indexed: false
			},
			{
				name: 'provider',
				type: 'address',
				indexed: false
			},
			{
				name: 'recipient',
				type: 'address',
				indexed: false
			}
		],
		name: 'LiquidityProviderSwap',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'hash',
				type: 'bytes32',
				indexed: false
			},
			{
				name: 'selector',
				type: 'bytes4',
				indexed: true
			},
			{
				name: 'signer',
				type: 'address',
				indexed: false
			},
			{
				name: 'sender',
				type: 'address',
				indexed: false
			}
		],
		name: 'MetaTransactionExecuted',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'caller',
				type: 'address',
				indexed: false
			},
			{
				name: 'migrator',
				type: 'address',
				indexed: false
			},
			{
				name: 'newOwner',
				type: 'address',
				indexed: false
			}
		],
		name: 'Migrated',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'orderHash',
				type: 'bytes32',
				indexed: false
			},
			{
				name: 'maker',
				type: 'address',
				indexed: false
			}
		],
		name: 'OrderCancelled',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'maker',
				type: 'address',
				indexed: false
			},
			{
				name: 'signer',
				type: 'address',
				indexed: false
			},
			{
				name: 'allowed',
				type: 'bool',
				indexed: false
			}
		],
		name: 'OrderSignerRegistered',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'orderHash',
				type: 'bytes32',
				indexed: false
			},
			{
				name: 'maker',
				type: 'address',
				indexed: false
			},
			{
				name: 'taker',
				type: 'address',
				indexed: false
			},
			{
				name: 'makerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'takerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128',
				indexed: false
			},
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128',
				indexed: false
			}
		],
		name: 'OtcOrderFilled',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'previousOwner',
				type: 'address',
				indexed: true
			},
			{
				name: 'newOwner',
				type: 'address',
				indexed: true
			}
		],
		name: 'OwnershipTransferred',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'maker',
				type: 'address',
				indexed: false
			},
			{
				name: 'makerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'takerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'minValidSalt',
				type: 'uint256',
				indexed: false
			}
		],
		name: 'PairCancelledLimitOrders',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'maker',
				type: 'address',
				indexed: false
			},
			{
				name: 'makerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'takerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'minValidSalt',
				type: 'uint256',
				indexed: false
			}
		],
		name: 'PairCancelledRfqOrders',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'selector',
				type: 'bytes4',
				indexed: true
			},
			{
				name: 'oldImpl',
				type: 'address',
				indexed: false
			},
			{
				name: 'newImpl',
				type: 'address',
				indexed: false
			}
		],
		name: 'ProxyFunctionUpdated',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'quoteSigner',
				type: 'address',
				indexed: false
			}
		],
		name: 'QuoteSignerUpdated',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'orderHash',
				type: 'bytes32',
				indexed: false
			},
			{
				name: 'maker',
				type: 'address',
				indexed: false
			},
			{
				name: 'taker',
				type: 'address',
				indexed: false
			},
			{
				name: 'makerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'takerToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128',
				indexed: false
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128',
				indexed: false
			},
			{
				name: 'pool',
				type: 'bytes32',
				indexed: false
			}
		],
		name: 'RfqOrderFilled',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'origin',
				type: 'address',
				indexed: false
			},
			{
				name: 'addrs',
				type: 'address[]',
				indexed: false
			},
			{
				name: 'allowed',
				type: 'bool',
				indexed: false
			}
		],
		name: 'RfqOrderOriginsAllowed',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'taker',
				type: 'address',
				indexed: true
			},
			{
				name: 'inputToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'outputToken',
				type: 'address',
				indexed: false
			},
			{
				name: 'inputTokenAmount',
				type: 'uint256',
				indexed: false
			},
			{
				name: 'outputTokenAmount',
				type: 'uint256',
				indexed: false
			}
		],
		name: 'TransformedERC20',
		outputs: [],
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				name: 'transformerDeployer',
				type: 'address',
				indexed: false
			}
		],
		name: 'TransformerDeployerUpdated',
		outputs: [],
		type: 'event'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmount',
				type: 'uint128'
			},
			{
				name: 'taker',
				type: 'address'
			},
			{
				name: 'sender',
				type: 'address'
			}
		],
		name: '_fillLimitOrder',
		outputs: [
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128'
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'expiryAndNonce',
						type: 'uint256'
					}
				]
			},
			{
				name: 'makerSignature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmount',
				type: 'uint128'
			},
			{
				name: 'taker',
				type: 'address'
			},
			{
				name: 'useSelfBalance',
				type: 'bool'
			},
			{
				name: 'recipient',
				type: 'address'
			}
		],
		name: '_fillOtcOrder',
		outputs: [
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128'
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmount',
				type: 'uint128'
			},
			{
				name: 'taker',
				type: 'address'
			},
			{
				name: 'useSelfBalance',
				type: 'bool'
			},
			{
				name: 'recipient',
				type: 'address'
			}
		],
		name: '_fillRfqOrder',
		outputs: [
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128'
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'encodedPath',
				type: 'bytes'
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			},
			{
				name: 'recipient',
				type: 'address'
			}
		],
		name: '_sellHeldTokenForTokenToUniswapV3',
		outputs: [
			{
				name: 'buyAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'args',
				type: 'tuple',
				components: [
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'inputToken',
						type: 'address'
					},
					{
						name: 'outputToken',
						type: 'address'
					},
					{
						name: 'inputTokenAmount',
						type: 'uint256'
					},
					{
						name: 'minOutputTokenAmount',
						type: 'uint256'
					},
					{
						name: 'transformations',
						type: 'tuple[]',
						components: [
							{
								name: 'deploymentNonce',
								type: 'uint32'
							},
							{
								name: 'data',
								type: 'bytes'
							}
						]
					},
					{
						name: 'useSelfBalance',
						type: 'bool'
					},
					{
						name: 'recipient',
						type: 'address'
					}
				]
			}
		],
		name: '_transformERC20',
		outputs: [
			{
				name: 'outputTokenAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'orders',
				type: 'tuple[]',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			}
		],
		name: 'batchCancelLimitOrders',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'makerTokens',
				type: 'address[]'
			},
			{
				name: 'takerTokens',
				type: 'address[]'
			},
			{
				name: 'minValidSalts',
				type: 'uint256[]'
			}
		],
		name: 'batchCancelPairLimitOrders',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'maker',
				type: 'address'
			},
			{
				name: 'makerTokens',
				type: 'address[]'
			},
			{
				name: 'takerTokens',
				type: 'address[]'
			},
			{
				name: 'minValidSalts',
				type: 'uint256[]'
			}
		],
		name: 'batchCancelPairLimitOrdersWithSigner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'makerTokens',
				type: 'address[]'
			},
			{
				name: 'takerTokens',
				type: 'address[]'
			},
			{
				name: 'minValidSalts',
				type: 'uint256[]'
			}
		],
		name: 'batchCancelPairRfqOrders',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'maker',
				type: 'address'
			},
			{
				name: 'makerTokens',
				type: 'address[]'
			},
			{
				name: 'takerTokens',
				type: 'address[]'
			},
			{
				name: 'minValidSalts',
				type: 'uint256[]'
			}
		],
		name: 'batchCancelPairRfqOrdersWithSigner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'orders',
				type: 'tuple[]',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			}
		],
		name: 'batchCancelRfqOrders',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'mtxs',
				type: 'tuple[]',
				components: [
					{
						name: 'signer',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'minGasPrice',
						type: 'uint256'
					},
					{
						name: 'maxGasPrice',
						type: 'uint256'
					},
					{
						name: 'expirationTimeSeconds',
						type: 'uint256'
					},
					{
						name: 'salt',
						type: 'uint256'
					},
					{
						name: 'callData',
						type: 'bytes'
					},
					{
						name: 'value',
						type: 'uint256'
					},
					{
						name: 'feeToken',
						type: 'address'
					},
					{
						name: 'feeAmount',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signatures',
				type: 'tuple[]',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			}
		],
		name: 'batchExecuteMetaTransactions',
		outputs: [
			{
				name: 'returnResults',
				type: 'bytes[]'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'orders',
				type: 'tuple[]',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signatures',
				type: 'tuple[]',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmounts',
				type: 'uint128[]'
			},
			{
				name: 'revertIfIncomplete',
				type: 'bool'
			}
		],
		name: 'batchFillLimitOrders',
		outputs: [
			{
				name: 'takerTokenFilledAmounts',
				type: 'uint128[]'
			},
			{
				name: 'makerTokenFilledAmounts',
				type: 'uint128[]'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'orders',
				type: 'tuple[]',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signatures',
				type: 'tuple[]',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmounts',
				type: 'uint128[]'
			},
			{
				name: 'revertIfIncomplete',
				type: 'bool'
			}
		],
		name: 'batchFillRfqOrders',
		outputs: [
			{
				name: 'takerTokenFilledAmounts',
				type: 'uint128[]'
			},
			{
				name: 'makerTokenFilledAmounts',
				type: 'uint128[]'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'orders',
				type: 'tuple[]',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'expiryAndNonce',
						type: 'uint256'
					}
				]
			},
			{
				name: 'makerSignatures',
				type: 'tuple[]',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerSignatures',
				type: 'tuple[]',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'unwrapWeth',
				type: 'bool[]'
			}
		],
		name: 'batchFillTakerSignedOtcOrders',
		outputs: [
			{
				name: 'successes',
				type: 'bool[]'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'orders',
				type: 'tuple[]',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signatures',
				type: 'tuple[]',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			}
		],
		name: 'batchGetLimitOrderRelevantStates',
		outputs: [
			{
				name: 'orderInfos',
				type: 'tuple[]',
				components: [
					{
						name: 'orderHash',
						type: 'bytes32'
					},
					{
						name: 'status',
						type: 'uint8'
					},
					{
						name: 'takerTokenFilledAmount',
						type: 'uint128'
					}
				]
			},
			{
				name: 'actualFillableTakerTokenAmounts',
				type: 'uint128[]'
			},
			{
				name: 'isSignatureValids',
				type: 'bool[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'orders',
				type: 'tuple[]',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signatures',
				type: 'tuple[]',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			}
		],
		name: 'batchGetRfqOrderRelevantStates',
		outputs: [
			{
				name: 'orderInfos',
				type: 'tuple[]',
				components: [
					{
						name: 'orderHash',
						type: 'bytes32'
					},
					{
						name: 'status',
						type: 'uint8'
					},
					{
						name: 'takerTokenFilledAmount',
						type: 'uint128'
					}
				]
			},
			{
				name: 'actualFillableTakerTokenAmounts',
				type: 'uint128[]'
			},
			{
				name: 'isSignatureValids',
				type: 'bool[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			}
		],
		name: 'cancelLimitOrder',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'makerToken',
				type: 'address'
			},
			{
				name: 'takerToken',
				type: 'address'
			},
			{
				name: 'minValidSalt',
				type: 'uint256'
			}
		],
		name: 'cancelPairLimitOrders',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'maker',
				type: 'address'
			},
			{
				name: 'makerToken',
				type: 'address'
			},
			{
				name: 'takerToken',
				type: 'address'
			},
			{
				name: 'minValidSalt',
				type: 'uint256'
			}
		],
		name: 'cancelPairLimitOrdersWithSigner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'makerToken',
				type: 'address'
			},
			{
				name: 'takerToken',
				type: 'address'
			},
			{
				name: 'minValidSalt',
				type: 'uint256'
			}
		],
		name: 'cancelPairRfqOrders',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'maker',
				type: 'address'
			},
			{
				name: 'makerToken',
				type: 'address'
			},
			{
				name: 'takerToken',
				type: 'address'
			},
			{
				name: 'minValidSalt',
				type: 'uint256'
			}
		],
		name: 'cancelPairRfqOrdersWithSigner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			}
		],
		name: 'cancelRfqOrder',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'createTransformWallet',
		outputs: [
			{
				name: 'wallet',
				type: 'address'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'mtx',
				type: 'tuple',
				components: [
					{
						name: 'signer',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'minGasPrice',
						type: 'uint256'
					},
					{
						name: 'maxGasPrice',
						type: 'uint256'
					},
					{
						name: 'expirationTimeSeconds',
						type: 'uint256'
					},
					{
						name: 'salt',
						type: 'uint256'
					},
					{
						name: 'callData',
						type: 'bytes'
					},
					{
						name: 'value',
						type: 'uint256'
					},
					{
						name: 'feeToken',
						type: 'address'
					},
					{
						name: 'feeAmount',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			}
		],
		name: 'executeMetaTransaction',
		outputs: [
			{
				name: 'returnResult',
				type: 'bytes'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'selector',
				type: 'bytes4'
			},
			{
				name: 'impl',
				type: 'address'
			}
		],
		name: 'extend',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmount',
				type: 'uint128'
			}
		],
		name: 'fillLimitOrder',
		outputs: [
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128'
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmount',
				type: 'uint128'
			}
		],
		name: 'fillOrKillLimitOrder',
		outputs: [
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmount',
				type: 'uint128'
			}
		],
		name: 'fillOrKillRfqOrder',
		outputs: [
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'expiryAndNonce',
						type: 'uint256'
					}
				]
			},
			{
				name: 'makerSignature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmount',
				type: 'uint128'
			}
		],
		name: 'fillOtcOrder',
		outputs: [
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128'
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'expiryAndNonce',
						type: 'uint256'
					}
				]
			},
			{
				name: 'makerSignature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmount',
				type: 'uint128'
			}
		],
		name: 'fillOtcOrderForEth',
		outputs: [
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128'
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'expiryAndNonce',
						type: 'uint256'
					}
				]
			},
			{
				name: 'makerSignature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			}
		],
		name: 'fillOtcOrderWithEth',
		outputs: [
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128'
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerTokenFillAmount',
				type: 'uint128'
			}
		],
		name: 'fillRfqOrder',
		outputs: [
			{
				name: 'takerTokenFilledAmount',
				type: 'uint128'
			},
			{
				name: 'makerTokenFilledAmount',
				type: 'uint128'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'expiryAndNonce',
						type: 'uint256'
					}
				]
			},
			{
				name: 'makerSignature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerSignature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			}
		],
		name: 'fillTakerSignedOtcOrder',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'expiryAndNonce',
						type: 'uint256'
					}
				]
			},
			{
				name: 'makerSignature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			},
			{
				name: 'takerSignature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			}
		],
		name: 'fillTakerSignedOtcOrderForEth',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			}
		],
		name: 'getLimitOrderHash',
		outputs: [
			{
				name: 'orderHash',
				type: 'bytes32'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			}
		],
		name: 'getLimitOrderInfo',
		outputs: [
			{
				name: 'orderInfo',
				type: 'tuple',
				components: [
					{
						name: 'orderHash',
						type: 'bytes32'
					},
					{
						name: 'status',
						type: 'uint8'
					},
					{
						name: 'takerTokenFilledAmount',
						type: 'uint128'
					}
				]
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'takerTokenFeeAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'feeRecipient',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			}
		],
		name: 'getLimitOrderRelevantState',
		outputs: [
			{
				name: 'orderInfo',
				type: 'tuple',
				components: [
					{
						name: 'orderHash',
						type: 'bytes32'
					},
					{
						name: 'status',
						type: 'uint8'
					},
					{
						name: 'takerTokenFilledAmount',
						type: 'uint128'
					}
				]
			},
			{
				name: 'actualFillableTakerTokenAmount',
				type: 'uint128'
			},
			{
				name: 'isSignatureValid',
				type: 'bool'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'mtx',
				type: 'tuple',
				components: [
					{
						name: 'signer',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'minGasPrice',
						type: 'uint256'
					},
					{
						name: 'maxGasPrice',
						type: 'uint256'
					},
					{
						name: 'expirationTimeSeconds',
						type: 'uint256'
					},
					{
						name: 'salt',
						type: 'uint256'
					},
					{
						name: 'callData',
						type: 'bytes'
					},
					{
						name: 'value',
						type: 'uint256'
					},
					{
						name: 'feeToken',
						type: 'address'
					},
					{
						name: 'feeAmount',
						type: 'uint256'
					}
				]
			}
		],
		name: 'getMetaTransactionExecutedBlock',
		outputs: [
			{
				name: 'blockNumber',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'mtx',
				type: 'tuple',
				components: [
					{
						name: 'signer',
						type: 'address'
					},
					{
						name: 'sender',
						type: 'address'
					},
					{
						name: 'minGasPrice',
						type: 'uint256'
					},
					{
						name: 'maxGasPrice',
						type: 'uint256'
					},
					{
						name: 'expirationTimeSeconds',
						type: 'uint256'
					},
					{
						name: 'salt',
						type: 'uint256'
					},
					{
						name: 'callData',
						type: 'bytes'
					},
					{
						name: 'value',
						type: 'uint256'
					},
					{
						name: 'feeToken',
						type: 'address'
					},
					{
						name: 'feeAmount',
						type: 'uint256'
					}
				]
			}
		],
		name: 'getMetaTransactionHash',
		outputs: [
			{
				name: 'mtxHash',
				type: 'bytes32'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'mtxHash',
				type: 'bytes32'
			}
		],
		name: 'getMetaTransactionHashExecutedBlock',
		outputs: [
			{
				name: 'blockNumber',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'expiryAndNonce',
						type: 'uint256'
					}
				]
			}
		],
		name: 'getOtcOrderHash',
		outputs: [
			{
				name: 'orderHash',
				type: 'bytes32'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'expiryAndNonce',
						type: 'uint256'
					}
				]
			}
		],
		name: 'getOtcOrderInfo',
		outputs: [
			{
				name: 'orderInfo',
				type: 'tuple',
				components: [
					{
						name: 'orderHash',
						type: 'bytes32'
					},
					{
						name: 'status',
						type: 'uint8'
					}
				]
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getProtocolFeeMultiplier',
		outputs: [
			{
				name: 'multiplier',
				type: 'uint32'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getQuoteSigner',
		outputs: [
			{
				name: 'signer',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			}
		],
		name: 'getRfqOrderHash',
		outputs: [
			{
				name: 'orderHash',
				type: 'bytes32'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			}
		],
		name: 'getRfqOrderInfo',
		outputs: [
			{
				name: 'orderInfo',
				type: 'tuple',
				components: [
					{
						name: 'orderHash',
						type: 'bytes32'
					},
					{
						name: 'status',
						type: 'uint8'
					},
					{
						name: 'takerTokenFilledAmount',
						type: 'uint128'
					}
				]
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'order',
				type: 'tuple',
				components: [
					{
						name: 'makerToken',
						type: 'address'
					},
					{
						name: 'takerToken',
						type: 'address'
					},
					{
						name: 'makerAmount',
						type: 'uint128'
					},
					{
						name: 'takerAmount',
						type: 'uint128'
					},
					{
						name: 'maker',
						type: 'address'
					},
					{
						name: 'taker',
						type: 'address'
					},
					{
						name: 'txOrigin',
						type: 'address'
					},
					{
						name: 'pool',
						type: 'bytes32'
					},
					{
						name: 'expiry',
						type: 'uint64'
					},
					{
						name: 'salt',
						type: 'uint256'
					}
				]
			},
			{
				name: 'signature',
				type: 'tuple',
				components: [
					{
						name: 'signatureType',
						type: 'uint8'
					},
					{
						name: 'v',
						type: 'uint8'
					},
					{
						name: 'r',
						type: 'bytes32'
					},
					{
						name: 's',
						type: 'bytes32'
					}
				]
			}
		],
		name: 'getRfqOrderRelevantState',
		outputs: [
			{
				name: 'orderInfo',
				type: 'tuple',
				components: [
					{
						name: 'orderHash',
						type: 'bytes32'
					},
					{
						name: 'status',
						type: 'uint8'
					},
					{
						name: 'takerTokenFilledAmount',
						type: 'uint128'
					}
				]
			},
			{
				name: 'actualFillableTakerTokenAmount',
				type: 'uint128'
			},
			{
				name: 'isSignatureValid',
				type: 'bool'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'selector',
				type: 'bytes4'
			},
			{
				name: 'idx',
				type: 'uint256'
			}
		],
		name: 'getRollbackEntryAtIndex',
		outputs: [
			{
				name: 'impl',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'selector',
				type: 'bytes4'
			}
		],
		name: 'getRollbackLength',
		outputs: [
			{
				name: 'rollbackLength',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getTransformWallet',
		outputs: [
			{
				name: 'wallet',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getTransformerDeployer',
		outputs: [
			{
				name: 'deployer',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'maker',
				type: 'address'
			},
			{
				name: 'signer',
				type: 'address'
			}
		],
		name: 'isValidOrderSigner',
		outputs: [
			{
				name: 'isAllowed',
				type: 'bool'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'txOrigin',
				type: 'address'
			},
			{
				name: 'nonceBucket',
				type: 'uint64'
			}
		],
		name: 'lastOtcTxOriginNonce',
		outputs: [
			{
				name: 'lastNonce',
				type: 'uint128'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'target',
				type: 'address'
			},
			{
				name: 'data',
				type: 'bytes'
			},
			{
				name: 'newOwner',
				type: 'address'
			}
		],
		name: 'migrate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'outputToken',
				type: 'address'
			},
			{
				name: 'calls',
				type: 'tuple[]',
				components: [
					{
						name: 'id',
						type: 'uint8'
					},
					{
						name: 'sellAmount',
						type: 'uint256'
					},
					{
						name: 'data',
						type: 'bytes'
					}
				]
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			}
		],
		name: 'multiplexBatchSellEthForToken',
		outputs: [
			{
				name: 'boughtAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'inputToken',
				type: 'address'
			},
			{
				name: 'calls',
				type: 'tuple[]',
				components: [
					{
						name: 'id',
						type: 'uint8'
					},
					{
						name: 'sellAmount',
						type: 'uint256'
					},
					{
						name: 'data',
						type: 'bytes'
					}
				]
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			}
		],
		name: 'multiplexBatchSellTokenForEth',
		outputs: [
			{
				name: 'boughtAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'inputToken',
				type: 'address'
			},
			{
				name: 'outputToken',
				type: 'address'
			},
			{
				name: 'calls',
				type: 'tuple[]',
				components: [
					{
						name: 'id',
						type: 'uint8'
					},
					{
						name: 'sellAmount',
						type: 'uint256'
					},
					{
						name: 'data',
						type: 'bytes'
					}
				]
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			}
		],
		name: 'multiplexBatchSellTokenForToken',
		outputs: [
			{
				name: 'boughtAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'tokens',
				type: 'address[]'
			},
			{
				name: 'calls',
				type: 'tuple[]',
				components: [
					{
						name: 'id',
						type: 'uint8'
					},
					{
						name: 'data',
						type: 'bytes'
					}
				]
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			}
		],
		name: 'multiplexMultiHopSellEthForToken',
		outputs: [
			{
				name: 'boughtAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'tokens',
				type: 'address[]'
			},
			{
				name: 'calls',
				type: 'tuple[]',
				components: [
					{
						name: 'id',
						type: 'uint8'
					},
					{
						name: 'data',
						type: 'bytes'
					}
				]
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			}
		],
		name: 'multiplexMultiHopSellTokenForEth',
		outputs: [
			{
				name: 'boughtAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'tokens',
				type: 'address[]'
			},
			{
				name: 'calls',
				type: 'tuple[]',
				components: [
					{
						name: 'id',
						type: 'uint8'
					},
					{
						name: 'data',
						type: 'bytes'
					}
				]
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			}
		],
		name: 'multiplexMultiHopSellTokenForToken',
		outputs: [
			{
				name: 'boughtAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				name: 'ownerAddress',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'signer',
				type: 'address'
			},
			{
				name: 'allowed',
				type: 'bool'
			}
		],
		name: 'registerAllowedOrderSigner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'origins',
				type: 'address[]'
			},
			{
				name: 'allowed',
				type: 'bool'
			}
		],
		name: 'registerAllowedRfqOrigins',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'selector',
				type: 'bytes4'
			},
			{
				name: 'targetImpl',
				type: 'address'
			}
		],
		name: 'rollback',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'encodedPath',
				type: 'bytes'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			},
			{
				name: 'recipient',
				type: 'address'
			}
		],
		name: 'sellEthForTokenToUniswapV3',
		outputs: [
			{
				name: 'buyAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'inputToken',
				type: 'address'
			},
			{
				name: 'outputToken',
				type: 'address'
			},
			{
				name: 'provider',
				type: 'address'
			},
			{
				name: 'recipient',
				type: 'address'
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			},
			{
				name: 'auxiliaryData',
				type: 'bytes'
			}
		],
		name: 'sellToLiquidityProvider',
		outputs: [
			{
				name: 'boughtAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'tokens',
				type: 'address[]'
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			},
			{
				name: 'fork',
				type: 'uint8'
			}
		],
		name: 'sellToPancakeSwap',
		outputs: [
			{
				name: 'buyAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'tokens',
				type: 'address[]'
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			},
			{
				name: 'isSushi',
				type: 'bool'
			}
		],
		name: 'sellToUniswap',
		outputs: [
			{
				name: 'buyAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'encodedPath',
				type: 'bytes'
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			},
			{
				name: 'recipient',
				type: 'address'
			}
		],
		name: 'sellTokenForEthToUniswapV3',
		outputs: [
			{
				name: 'buyAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'encodedPath',
				type: 'bytes'
			},
			{
				name: 'sellAmount',
				type: 'uint256'
			},
			{
				name: 'minBuyAmount',
				type: 'uint256'
			},
			{
				name: 'recipient',
				type: 'address'
			}
		],
		name: 'sellTokenForTokenToUniswapV3',
		outputs: [
			{
				name: 'buyAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'quoteSigner',
				type: 'address'
			}
		],
		name: 'setQuoteSigner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'transformerDeployer',
				type: 'address'
			}
		],
		name: 'setTransformerDeployer',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'newOwner',
				type: 'address'
			}
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'poolIds',
				type: 'bytes32[]'
			}
		],
		name: 'transferProtocolFeesForPools',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'inputToken',
				type: 'address'
			},
			{
				name: 'outputToken',
				type: 'address'
			},
			{
				name: 'inputTokenAmount',
				type: 'uint256'
			},
			{
				name: 'minOutputTokenAmount',
				type: 'uint256'
			},
			{
				name: 'transformations',
				type: 'tuple[]',
				components: [
					{
						name: 'deploymentNonce',
						type: 'uint32'
					},
					{
						name: 'data',
						type: 'bytes'
					}
				]
			}
		],
		name: 'transformERC20',
		outputs: [
			{
				name: 'outputTokenAmount',
				type: 'uint256'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				name: 'amount0Delta',
				type: 'int256'
			},
			{
				name: 'amount1Delta',
				type: 'int256'
			},
			{
				name: 'data',
				type: 'bytes'
			}
		],
		name: 'uniswapV3SwapCallback',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
]
export default abi
