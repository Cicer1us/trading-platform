// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/RouterStorage.sol";
import "../../shared/libraries/LibDiamond.sol";

contract ConnectorTokenHolderFacet {
    RouterStorage internal s;

    struct ConnectorTokenHolderArgs {
        address holder;
        uint256 chainId;
    }

    /**
     * @notice Update address of the connector token
     * @param _connectorTokenHolders array of connector token holders args
     */
    function addConnectorTokenHolders(ConnectorTokenHolderArgs[] memory _connectorTokenHolders) external {
        LibDiamond.enforceIsContractOwner();
        for (uint256 i = 0; i < _connectorTokenHolders.length; i++) {
            ConnectorTokenHolderArgs memory holder = _connectorTokenHolders[i];
            s.connectorTokenHolder[holder.chainId] = holder.holder;
        }
    }

    /**
     * @notice Update address of the connector token
     * @param _chainId chain id of the cross chain router
     */
    function removeConnectorTokenHolder(uint256 _chainId) external {
        LibDiamond.enforceIsContractOwner();
        delete s.connectorTokenHolder[_chainId];
    }

    /**
     * @notice get cross chain connector token holder
     */
    function connectorTokenHolder(uint256 _chainId) external view returns (address) {
        return s.connectorTokenHolder[_chainId];
    }
}
