// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

library LibDestCrossSwap {
    using SafeERC20 for IERC20;

    event DestCrossSwap(
        uint256 srcChainId,
        bytes32 srcTransactionHash,
        address srcToken,
        uint256 srcAmount,
        address destToken,
        uint256 destAmount,
        address destUser,
        address connectorToken,
        uint256 connectorTokenOutcome,
        string liquidityProvider
    );

    struct SwapArgs {
        address provider;
        address approveProxy;
        bytes callData;
    }

    struct SrcCrossSwapEvent {
        uint256 chainId;
        bytes32 txHash;
        address srcToken;
        uint256 srcAmount;
        uint256 destChainId;
        address destToken;
        uint256 minDestAmount;
        address destUser;
        address connectorToken;
        uint256 connectorTokenIncome;
        address refundAddress;
        string liquidityProvider;
    }

    address internal constant NATIVE_TOKEN = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    /**
     * @notice executeSrcSwap
     *
     * @param callData encoded calldata of the swap
     * @param connectorToken desc
     * @param connectorTokenAmount desc
     * @param swapProvider desc
     * @param swapProviderApproveProxy desc
     */
    function _executeSwap(
        bytes calldata callData,
        address connectorToken,
        uint256 connectorTokenAmount,
        address swapProvider,
        address swapProviderApproveProxy
    ) internal {
        IERC20(connectorToken).approve(swapProviderApproveProxy, connectorTokenAmount);

        (bool txSuccess, ) = swapProvider.call{ value: 0 }(callData);

        // investigate if it really required
        /** @dev assembly allows to get tx failure reason here*/
        if (txSuccess == false) {
            assembly {
                let ptr := mload(0x40)
                let size := returndatasize()
                returndatacopy(ptr, 0, size)
                revert(ptr, size)
            }
        }
    }
}
