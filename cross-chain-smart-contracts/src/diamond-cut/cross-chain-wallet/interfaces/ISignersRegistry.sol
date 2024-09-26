// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISignersRegistry {
    function isPublicWhitelisted(address signer) external returns (bool);

    function isPrivateWhitelisted(address signerAdmin, address signer) external returns (bool);
}
