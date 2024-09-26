// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../libraries/RouterStorage.sol";
import "../../shared/libraries/LibDiamond.sol";

contract MultichainRoutersFacet {
    RouterStorage internal s;

    /**
     * @notice add address of the swap provider
     * @param _multichainRouter swap provider address
     */
    function addWhitelistedMultichainRouter(address _multichainRouter) external {
        LibDiamond.enforceIsContractOwner();
        s.whitelistedMultichainRouter[_multichainRouter] = true;
    }

    /**
     * @notice Remove address of the swap provider
     * @param _multichainRouter swap provider address
     */
    function removeWhitelistedMultichainRouter(address _multichainRouter) external {
        LibDiamond.enforceIsContractOwner();
        s.whitelistedMultichainRouter[_multichainRouter] = false;
    }

    /**
     * @notice get whitelisted multichain router, `true` if yes, `false` if no
     */
    function whitelistedMultichainRouter(address _multichainRouter) external view returns (bool) {
        return s.whitelistedMultichainRouter[_multichainRouter];
    }
}
