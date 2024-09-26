import { ButtonSimple } from '@/components/Buttons/Buttons';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';
import useMultilingual from '@/hooks/useMultilingual';
import { CrossChainParams, CrossChainTxStatus } from '@/interfaces/CrossChain.interface';
import { useWeb3React } from '@web3-react/core';
import CrossChainSwap from '../CrossChainSwap/CrossChainSwap';
import style from './ConfirmCrossSwap.module.css';
import { useDispatch } from 'react-redux';
import { updateBalances } from '@/redux/appSlice';
import { addPendingCrossSwap, setFirstCrossTxCompleted, setRejectStatusForCrossSwap } from '@/redux/crossChainSlice';
import { useSendCrossChainSrcSwap } from '@/hooks/useSendCrossChainSrcSwap';
import { isErrorHandledInMutationCallback } from '@/helpers/errorHandling';

//TODO: refactor modal state managing approach to prevent props drilling
interface ConfirmCrossSwapProps {
  crossChainParams: CrossChainParams;
  nativeTokenUsdPrices: Record<number, number>;
  slippage: string;
  onSuccess: () => void;
}

//error can have txHash in case of execution failure, check https://docs.ethers.org/v5/api/providers/types/#providers-TransactionResponse
interface SendTxError extends Error {
  transactionHash?: string;
}

const ConfirmCrossSwap: React.FC<ConfirmCrossSwapProps> = ({ crossChainParams, onSuccess }): JSX.Element => {
  const { t } = useMultilingual('swapModal');
  const { provider } = useWeb3React();

  const chainId = crossChainParams?.srcToken?.chainId;

  const dispatch = useDispatch();
  const { mutateAsync, isLoading } = useSendCrossChainSrcSwap({
    onError: (error: SendTxError) => {
      //TODO: handle user rejection error to display specific info modal/snackbar in new design
      Notify({
        state: NotifyEnum.ERROR,
        message: t('swapRejected'),
        link: { hash: error?.transactionHash, chainId },
      });
      //TODO: create transaction tracker and move this part there
      if (error?.transactionHash) {
        dispatch(setRejectStatusForCrossSwap(error.transactionHash));
      }
    },
    async onSuccess(tx, params) {
      Notify({
        state: NotifyEnum.WARNING,
        message: t('crossSwapFirstTxCreated'),
        link: { hash: tx.hash, chainId: params.data.srcChainId },
      });
      onSuccess();
      dispatch(
        addPendingCrossSwap({
          hash: tx.hash,
          minDestAmount: params.data.destSwap.minDestAmount,
          srcAmount: params.data.amount,
          srcToken: params.data.srcToken,
          srcChainId: params.data.srcChainId.toString(),
          destChainId: params.data.destChainId.toString(),
          destToken: params.data.destToken,
          destUser: params.user,
          initiator: params.user,
          connectorToken: params.data.srcSwap.connectorToken.address,
          refundAddress: params.user,
          liquidityProvider: params.data.route,
          firstTxGasCostUSD: params.data.srcSwap.estimatedGas.gasLimitUSD,
          secondTxGasCostUSD: params.data.destSwap.estimatedGas.gasLimitUSD,
        })
      );
      //TODO: need to create transaction tracker and move this part there
      const receipt = await tx.wait();
      const hash = receipt.transactionHash;
      Notify({ state: NotifyEnum.SUCCESS, message: t('crossSwapFirstTxCompleted'), link: { hash, chainId } });
      dispatch(updateBalances());
      dispatch(
        setFirstCrossTxCompleted(
          receipt.transactionHash,
          receipt.gasUsed.toString(),
          receipt.effectiveGasPrice.toString()
        )
      );
    },
  });

  const onConfirm = async () => {
    try {
      await mutateAsync({
        srcProvider: provider,
        data: crossChainParams.data,
        user: crossChainParams.refundAddress,
      });
    } catch (error) {
      if (!isErrorHandledInMutationCallback(error)) {
        throw error;
      }
    }
  };

  const srcTxFeeUsd = crossChainParams?.firstTxGasCostUSD;
  const destTxFeeUsd = crossChainParams?.secondTxGasCostUSD;

  return (
    <>
      <h3 className={style.title}>{t('transactionDetails')}</h3>
      <div className={style.subTitle}>{t('checkAndConfirm')}</div>
      <CrossChainSwap
        status={CrossChainTxStatus?.NOT_CREATED}
        srcToken={crossChainParams?.srcToken}
        destToken={crossChainParams?.destToken}
        srcTxFee={srcTxFeeUsd}
        destTxFee={destTxFeeUsd}
        srcTxFeeUsd={srcTxFeeUsd}
        destTxFeeUsd={destTxFeeUsd}
        route={crossChainParams.crossRoute}
      />
      <div className={style.buttonContainer}>
        <ButtonSimple isLoading={isLoading} disabled={isLoading} onClick={onConfirm}>
          {t('confirmSwap')}
        </ButtonSimple>
      </div>
    </>
  );
};

export default ConfirmCrossSwap;
