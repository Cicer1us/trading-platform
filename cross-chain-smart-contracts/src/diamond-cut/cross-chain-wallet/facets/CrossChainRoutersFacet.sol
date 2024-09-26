// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/WalletStorage.sol";
import "../../shared/libraries/LibDiamond.sol";

contract CrossChainRoutersFacet {
    WalletStorage internal s;

    struct CrossChainRouterArgs {
        address router;
        uint256 chainId;
    }

    /**
     * @notice Update address of the connector token
     * @param _routers array of cross chain routers
     */
    function addCrossChainRouters(CrossChainRouterArgs[] memory _routers) external {
        LibDiamond.enforceIsContractOwner();
        for (uint256 i = 0; i < _routers.length; i++) {
            CrossChainRouterArgs memory router = _routers[i];
            s.crossChainRouters[router.chainId] = router.router;
        }
    }

    /**
     * @notice Update address of the connector token
     * @param _chainId chain id of the cross chain router
     */
    function removeCrossChainRouter(uint256 _chainId) external {
        LibDiamond.enforceIsContractOwner();
        delete s.crossChainRouters[_chainId];
    }

    /**
     * @notice get cross chain router address
     */
    function crossChainRouter(uint256 _chainId) external view returns (address) {
        return s.crossChainRouters[_chainId];
    }
}
