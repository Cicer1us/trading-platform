// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/WalletStorage.sol";
import "../../shared/libraries/LibDiamond.sol";

contract ConnectorTokensDecimalsFacet {
    WalletStorage internal s;

    struct ConnectorTokenArgs {
        address token;
        uint256 decimals;
        uint256 chainId;
    }

    /**
     * @notice Update address and decimals of the connector token
     * @param _connectorTokens array of connector tokens with decimals
     */
    function addWhitelistedConnectorTokenDecimals(ConnectorTokenArgs[] memory _connectorTokens) public {
        LibDiamond.enforceIsContractOwner();
        for (uint256 i = 0; i < _connectorTokens.length; i++) {
            ConnectorTokenArgs memory token = _connectorTokens[i];
            s.whitelistedConnectorTokenDecimals[token.chainId][token.token] = token.decimals;
        }
    }

    /**
     * @notice Remove address and decimals of the connector token
     * @param _connectorToken address of the connector token
     */
    function removeWhitelistedConnectorTokenDecimals(uint256 _chainId, address _connectorToken) external {
        LibDiamond.enforceIsContractOwner();
        delete s.whitelistedConnectorTokenDecimals[_chainId][_connectorToken];
    }

    /**
     * @notice get whitelisted connector token decimals, `0` if token is not whitelisted
     */
    function whitelistedConnectorTokenDecimals(uint256 _chainId, address _connectorToken)
        external
        view
        returns (uint256)
    {
        return s.whitelistedConnectorTokenDecimals[_chainId][_connectorToken];
    }
}
