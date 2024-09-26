// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IMultichainRouter.sol";

library LibMultichainTokenBridge {
    using SafeERC20 for IERC20;

    /**
     * @notice method to bridge usdc from src chain to dest chain via Multichain
     *
     * @param connectorToken address of token to be bridged
     * @param connectorTokenHolder address where to bridge token on dest chain
     * @param amountToBridge amount of the connector token to be bridged during cross chain swap
     * @param multichainToken multichainToken
     * @param destChainId chainId of destinational chain in cross chain swap
     * @param multichainRouter  multichain router where connector token will be bridged
     */
    function _bridgeConnectorToken(
        address connectorToken,
        address connectorTokenHolder,
        uint256 amountToBridge,
        address multichainToken,
        uint256 destChainId,
        address multichainRouter
    ) internal {
        IERC20(connectorToken).approve(multichainRouter, amountToBridge);
        IMultichainRouter(multichainRouter).anySwapOutUnderlying(
            multichainToken,
            connectorTokenHolder,
            amountToBridge,
            destChainId
        );
    }
}
