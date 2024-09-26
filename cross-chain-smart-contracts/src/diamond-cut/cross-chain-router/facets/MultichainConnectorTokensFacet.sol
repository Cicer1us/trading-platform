// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../libraries/RouterStorage.sol";
import "../../shared/libraries/LibDiamond.sol";

contract MultichainConnectorTokensFacet {
    RouterStorage internal s;

    /**
     * @notice add address of the swap provider
     *
     * @param _connectorToken real connector token
     * @param _multichainAnyToken multichain anyToken corresponding to the _connectorToken
     */
    function addMultichainConnectorToken(address _connectorToken, address _multichainAnyToken) external {
        LibDiamond.enforceIsContractOwner();
        s.connectorTokenToMultichainAnyToken[_connectorToken] = _multichainAnyToken;
    }

    /**
     * @notice Remove address of the swap provider
     *
     * @param _connectorToken real connector token
     */
    function removeMultichainConnectorToken(address _connectorToken) external {
        LibDiamond.enforceIsContractOwner();
        delete s.connectorTokenToMultichainAnyToken[_connectorToken];
    }

    /**
     * @notice get multichain any token by connector token
     */
    function multichainConnectorToken(address _connectorToken) external view returns (address) {
        return s.connectorTokenToMultichainAnyToken[_connectorToken];
    }
}
