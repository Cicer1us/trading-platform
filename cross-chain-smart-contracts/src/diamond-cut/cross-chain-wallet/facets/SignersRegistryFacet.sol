// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/WalletStorage.sol";
import "../../shared/libraries/LibDiamond.sol";

contract SignersRegistryFacet {
    WalletStorage internal s;

    /**
     * @notice Update address of the connector token
     * @param _signersRegistry new address of the oracle proivder
     */
    function setSignersRegistry(address _signersRegistry) external {
        LibDiamond.enforceIsContractOwner();
        s.signersRegistry = _signersRegistry;
    }

    /**
     * @notice get oracle provider address
     */
    function signersRegistry() external view returns (address) {
        return s.signersRegistry;
    }
}
