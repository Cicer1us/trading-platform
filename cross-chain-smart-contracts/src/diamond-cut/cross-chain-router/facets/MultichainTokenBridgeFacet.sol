// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../libraries/RouterStorage.sol";
import "../libraries/LibSrcCrossSwap.sol";
import "../libraries/LibMultichainTokenBridge.sol";

contract MultichainTokenBridgeFacet {
    RouterStorage internal s;

    using SafeERC20 for IERC20;

    /**
     * @notice this method should be called only if cross-chain swap is more than 12 USDC and own liquidity is not enough
     *
     * @param crossSwapArgs cross swap arguments (srcToken; srcAmount; destChainId; destToken; minDestAmount; destUser; connectorToken; refundAddress;)
     * @param srcSwapArgs swap provider where the swap from srcToken to connectedToken will be performed (provider,approveProxy, callData)
     * @param multichainRouter multichain router where connector token will be bridged
     */
    function initMultichainSwap(
        LibSrcCrossSwap.CrossSwapArgs calldata crossSwapArgs,
        LibSrcCrossSwap.SrcSwapArgs calldata srcSwapArgs,
        address multichainRouter
    ) public payable {
        require(s.whitelistedConnectorTokens[crossSwapArgs.connectorToken], "Connector token is not whitelisted");
        require(s.whitelistedMultichainRouter[multichainRouter], "Multichain Router is not whitelisted");

        // todo: consider removing it
        uint256 connectorTokenBalanceBeforeSwap = IERC20(crossSwapArgs.connectorToken).balanceOf(address(this));

        if (crossSwapArgs.srcToken == crossSwapArgs.connectorToken) {
            //!!!todo: check if address(this) is address of diamond, not of this facet
            // address(this) == diamond
            IERC20(crossSwapArgs.srcToken).safeTransferFrom(msg.sender, address(this), crossSwapArgs.srcAmount);
        } else {
            require(s.whitelistedSwapProviders[srcSwapArgs.provider], "Swap provider is not whitelisted");
            LibSrcCrossSwap._executeSwap(
                srcSwapArgs.callData,
                crossSwapArgs.srcToken,
                crossSwapArgs.srcAmount,
                srcSwapArgs.provider,
                srcSwapArgs.approveProxy
            );
        }

        // todo: consider replacing connectorTokenIncome to
        // uint256 connectorTokenIncome = IERC20(crossSwapArgs.connectorToken).balanceOf(address(this));

        // calc income = balanceAfter minus balanceBefore
        uint256 connectorTokenIncome = IERC20(crossSwapArgs.connectorToken).balanceOf(address(this)) -
            connectorTokenBalanceBeforeSwap;

        require(connectorTokenIncome > 0, "Connector token income should be positive");

        LibMultichainTokenBridge._bridgeConnectorToken(
            crossSwapArgs.connectorToken,
            s.connectorTokenHolder[crossSwapArgs.destChainId],
            connectorTokenIncome,
            s.connectorTokenToMultichainAnyToken[crossSwapArgs.connectorToken],
            crossSwapArgs.destChainId,
            multichainRouter
        );

        emit LibSrcCrossSwap.SrcCrossSwap(
            crossSwapArgs.srcToken,
            crossSwapArgs.srcAmount,
            crossSwapArgs.destChainId,
            crossSwapArgs.destToken,
            crossSwapArgs.minDestAmount,
            crossSwapArgs.destUser,
            crossSwapArgs.connectorToken,
            connectorTokenIncome,
            crossSwapArgs.refundAddress,
            "multichain"
        );
    }
}
