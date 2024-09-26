// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/WalletStorage.sol";
import "../../shared/libraries/LibDiamond.sol";

contract WalletSwapProvidersFacet {
    WalletStorage internal s;

    /**
     * @notice add address of the swap provider
     * @param _swapProvider swap provider address
     */
    function addWhitelistedSwapProvider(address _swapProvider) external {
        LibDiamond.enforceIsContractOwner();
        s.whitelistedSwapProviders[_swapProvider] = true;
    }

    /**
     * @notice Remove address of the swap provider
     * @param _swapProvider swap provider address
     */
    function removeWhitelistedSwapProvider(address _swapProvider) external {
        LibDiamond.enforceIsContractOwner();
        s.whitelistedSwapProviders[_swapProvider] = false;
    }

    /**
     * @notice get whitelisted swap provider, `true` if yes, `false` if no
     */
    function whitelistedSwapProvider(address _swapProvider) external view returns (bool) {
        return s.whitelistedSwapProviders[_swapProvider];
    }
}
