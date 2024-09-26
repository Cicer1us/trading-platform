// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/RouterStorage.sol";
import "../../shared/libraries/LibDiamond.sol";

contract ConnectorTokensFacet {
    RouterStorage internal s;

    /**
     * @notice Update address of the connector token
     * @param _connectorToken new address of the connector token
     */
    function addWhitelistedConnectorToken(address _connectorToken) external {
        LibDiamond.enforceIsContractOwner();
        s.whitelistedConnectorTokens[_connectorToken] = true;
    }

    /**
     * @notice Update address of the connector token
     * @param _connectorToken address of the connector token
     */
    function removeWhitelistedConnectorToken(address _connectorToken) external {
        LibDiamond.enforceIsContractOwner();
        s.whitelistedConnectorTokens[_connectorToken] = false;
    }

    /**
     * @notice get whitelisted connector token, `true` if yes, `false` if no
     */
    function whitelistedConnectorToken(address _connectorToken) external view returns (bool) {
        return s.whitelistedConnectorTokens[_connectorToken];
    }
}
