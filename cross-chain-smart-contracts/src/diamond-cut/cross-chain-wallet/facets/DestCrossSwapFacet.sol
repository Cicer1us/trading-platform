// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/WalletStorage.sol";
import "../libraries/LibDestCrossSwap.sol";
import "../../shared/libraries/LibDiamond.sol";
import "../interfaces/ISignersRegistry.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract DestCrossSwapFacet {
    WalletStorage internal s;

    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    function execute(
        address _to,
        uint256 _value,
        bytes calldata _callData
    ) external payable returns (bytes memory) {
        LibDiamond.enforceIsContractOwner();
        (bool success, bytes memory resultData) = _to.call{ value: _value }(_callData);
        require(success, "Arbitrary tx failed");
        return resultData;
    }

    /**
     * @notice method for refund src transaction
     *
     * @param signature signature of SrcCrossSwap event from oracle
     * @param refundToken refund token
     * @param srcEvent SrcCrossSwap event
     */
    function refundSrcTransaction(
        bytes calldata signature,
        address refundToken,
        LibDestCrossSwap.SrcCrossSwapEvent calldata srcEvent
    ) public payable {
        require(msg.sender == srcEvent.refundAddress, "Caller is not refund address");
        require(
            !s.completedCrossSwaps[string(abi.encodePacked(srcEvent.chainId, srcEvent.txHash))],
            "SrcCrossSwap was already completed"
        );
        require(
            s.whitelistedConnectorTokenDecimals[block.chainid][refundToken] != 0,
            "Refund token is not whitelisted"
        );

        _verifySrcCrossSwapEvent(srcEvent, signature);

        // prevent math calc for same decimalsUsdcDividersByChainId amount
        uint256 income = convertToDecimalFactor(
            srcEvent.connectorTokenIncome,
            srcEvent.chainId,
            srcEvent.connectorToken
        );
        uint256 outcome = convertFromDecimalFactor(income, block.chainid, refundToken);

        s.completedCrossSwaps[string(abi.encodePacked(srcEvent.chainId, srcEvent.txHash))] = true;

        // todo: transfer to destUser or to the refundAddress ??
        IERC20(refundToken).transfer(srcEvent.destUser, outcome);

        emit LibDestCrossSwap.DestCrossSwap(
            srcEvent.chainId,
            srcEvent.txHash,
            srcEvent.srcToken,
            srcEvent.srcAmount,
            refundToken,
            outcome,
            srcEvent.destUser,
            refundToken,
            outcome,
            "bitoftrade"
        );
    }

    function finishCrossSwap(
        LibDestCrossSwap.SrcCrossSwapEvent calldata srcEvent,
        LibDestCrossSwap.SwapArgs calldata destSwapArgs,
        bytes calldata signature,
        address connectorToken
    ) public payable {
        require(
            !s.completedCrossSwaps[string(abi.encodePacked(srcEvent.chainId, srcEvent.txHash))],
            "SrcCrossSwap was already completed"
        );
        require(
            s.whitelistedConnectorTokenDecimals[block.chainid][connectorToken] != 0 &&
                s.whitelistedConnectorTokenDecimals[srcEvent.chainId][srcEvent.connectorToken] != 0,
            "ConnectorToken token is not whitelisted"
        );

        _verifySrcCrossSwapEvent(srcEvent, signature);

        uint256 connectorTokenBalanceBeforeSwap = getBalance(connectorToken, address(this));
        uint256 userBalanceBeforeSwap = getBalance(srcEvent.destToken, srcEvent.destUser);

        if (srcEvent.destToken == connectorToken) {
            IERC20(srcEvent.destToken).safeTransfer(srcEvent.destUser, srcEvent.minDestAmount);
        } else {
            require(s.whitelistedSwapProviders[destSwapArgs.provider], "Swap provider is not whitelisted");
            uint256 incomeDecimalFactor = convertToDecimalFactor(
                srcEvent.connectorTokenIncome,
                srcEvent.chainId,
                srcEvent.connectorToken
            );
            uint256 maxConnectorTokenOutcome = convertFromDecimalFactor(
                incomeDecimalFactor,
                block.chainid,
                connectorToken
            );
            LibDestCrossSwap._executeSwap(
                destSwapArgs.callData,
                connectorToken,
                maxConnectorTokenOutcome,
                destSwapArgs.provider,
                destSwapArgs.approveProxy
            );
        }

        uint256 connectorTokenOutcome = connectorTokenBalanceBeforeSwap - getBalance(connectorToken, address(this));
        uint256 userIncome = getBalance(srcEvent.destToken, srcEvent.destUser) - userBalanceBeforeSwap;

        s.completedCrossSwaps[string(abi.encodePacked(srcEvent.chainId, srcEvent.txHash))] = true;

        require(userIncome >= srcEvent.minDestAmount, "User received less then expected");

        require(
            convertToDecimalFactor(connectorTokenOutcome, block.chainid, connectorToken) <=
                convertToDecimalFactor(srcEvent.connectorTokenIncome, srcEvent.chainId, srcEvent.connectorToken),
            "Outcome should be not less than income"
        );

        emit LibDestCrossSwap.DestCrossSwap(
            srcEvent.chainId,
            srcEvent.txHash,
            srcEvent.srcToken,
            srcEvent.srcAmount,
            srcEvent.destToken,
            userIncome,
            srcEvent.destUser,
            connectorToken,
            connectorTokenOutcome,
            "bitoftrade"
        );
    }

    function convertToDecimalFactor(
        uint256 amount,
        uint256 chainId,
        address connectorToken
    ) internal view returns (uint256) {
        return amount / (10**(s.whitelistedConnectorTokenDecimals[chainId][connectorToken] - 6));
    }

    function convertFromDecimalFactor(
        uint256 amount,
        uint256 chainId,
        address connectorToken
    ) internal view returns (uint256) {
        return amount * 10**(s.whitelistedConnectorTokenDecimals[chainId][connectorToken] - 6);
    }

    function _verifySrcCrossSwapEvent(LibDestCrossSwap.SrcCrossSwapEvent calldata srcEvent, bytes calldata signature)
        internal
    {
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "SrcCrossSwap",
                srcEvent.chainId,
                s.crossChainRouters[srcEvent.chainId],
                srcEvent.txHash,
                srcEvent.srcToken,
                srcEvent.srcAmount,
                block.chainid,
                srcEvent.destToken,
                srcEvent.minDestAmount,
                srcEvent.destUser,
                srcEvent.connectorToken,
                srcEvent.connectorTokenIncome,
                srcEvent.refundAddress,
                srcEvent.liquidityProvider
            )
        );

        address signer = messageHash.recover(signature);
        require(ISignersRegistry(s.signersRegistry).isPublicWhitelisted(signer), "Signer is not whitelisted");
    }

    function getBalance(address token, address user) private view returns (uint256) {
        return token == LibDestCrossSwap.NATIVE_TOKEN ? address(user).balance : IERC20(token).balanceOf(user);
    }
}
