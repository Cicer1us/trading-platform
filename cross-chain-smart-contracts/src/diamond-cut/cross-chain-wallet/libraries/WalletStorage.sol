// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct WalletStorage {
    address signersRegistry;
    mapping(address => bool) whitelistedSwapProviders;
    // chainId => token address => decimal
    mapping(uint256 => mapping(address => uint256)) whitelistedConnectorTokenDecimals;
    // chainId => crossChainRouter
    mapping(uint256 => address) crossChainRouters;
    mapping(string => bool) completedCrossSwaps;
}
