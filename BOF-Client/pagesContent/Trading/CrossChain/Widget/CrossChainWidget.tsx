import style from './CrossChainWidget.module.css';
import ButtonSwitch from '@/components/ButtonSwitch/ButtonSwitch';
import { SelectTokenModal, setSelectedTokenA, setSelectedTokenB } from '@/redux/widgetSlice';
import React, { useEffect, useState } from 'react';
import WidgetSendButton from 'pagesContent/Trading/Widget/WidgetSendButton/WidgetSendButton';
import Input from '../Components/Input/Input';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import PendingApproveModal from 'pagesContent/Trading/Widget/ApproveModal/PendingApproveModal';
import { batch, useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { CrossSwapPrice, getCrossSwapPrice } from '@/common/crossSwapSdk';
import { PriceInput } from '@/interfaces/SwapPrice.interface';
import { convertFromWei, convertToWei } from '@/helpers/convertFromToWei';
import { Chain, connectorTokens, CrossChainPriceError, SwapStatus, usdcToken } from '@bitoftrade/cross-chain-core';
import {
  setCrossDestAmount,
  setCrossSrcAmount,
  setLastParams,
  updateAllowances,
  updateNativeTokenUsdPrices,
} from '@/redux/crossChainSlice';
import useMultilingual from '@/hooks/useMultilingual';
import SameChainError from '../Components/SameChainError/SameChainError';
import Modal from '@/components/Modal/Modal';
import CrossSwapModal from '../Components/CrossSwapModal/CrossSwapModal';
import WrongChainError from '../Components/SameChainError/WrongChainError';
import { chains } from 'connection/chainConfig';
import MetaTags from '@/components/MetaTags/MetaTags';
import { Alert } from '@/components/Alert/Alert';

const CrossChainWidget: React.FC = (): JSX.Element => {
  const { t, tc } = useMultilingual('widget');

  const balances = useAppSelector(({ app }) => app.balances);
  const chainId = useAppSelector(({ app }) => app.chainId);
  const srcToken = useAppSelector(({ widget }) => widget.selectedTokenA);
  const destToken = useAppSelector(({ widget }) => widget.selectedTokenB);
  const approves = useAppSelector(({ crossChain }) => crossChain.pendingApproveHashes);
  const srcTokenAmount = useAppSelector(({ crossChain }) => crossChain.srcAmount);
  const destTokenAmount = useAppSelector(({ crossChain }) => crossChain.destAmount);
  const slippage = useAppSelector(({ crossChain }) => crossChain.slippage);
  const allowances = useAppSelector(({ crossChain }) => crossChain.allowances);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(true);
  // const [srcTokenAllowance, setSrcTokenAllowance] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [openCrossModal, setOpenCrossModal] = useState<boolean>(false);

  const { account } = useWeb3React();

  const dispatch = useDispatch();

  const setSrcTokenAmount = (value: number | null) => {
    dispatch(setCrossSrcAmount(value));
  };

  const setDestTokenAmount = (value: number | null) => {
    dispatch(setCrossDestAmount(value));
  };

  useEffect(() => {
    setError('');
    if (srcToken && destToken && !!srcTokenAmount) {
      calcSwapPrice();
    }

    if (srcTokenAmount === null) {
      clearInputs();
    }
  }, [srcTokenAmount, srcToken, destToken]);

  useEffect(() => {
    checkApproved();
  }, [srcToken?.address, allowances]);

  useEffect(() => {
    dispatch(updateAllowances());
  }, [account, approves]);

  useEffect(() => {
    checkBalances();
  }, [balances]);

  useEffect(() => {
    dispatch(updateNativeTokenUsdPrices());
  }, []);

  const checkApproved = () => {
    if (
      account &&
      srcTokenAmount &&
      srcToken?.address &&
      srcToken?.address !== chains[srcToken?.chainId as Chain].nativeToken.address
    ) {
      setIsApproved(srcTokenAmount <= allowances?.[srcToken?.chainId as Chain]?.[srcToken?.address]);
    } else {
      setIsApproved(true);
    }
  };

  const clearInputs = () => {
    setSrcTokenAmount(null);
    setDestTokenAmount(null);
    setIsLoading(false);
  };

  const calcSwapPrice = async () => {
    if (srcTokenAmount && srcToken && destToken) {
      setIsLoading(true);
      const srcWeiAmount = convertToWei(srcTokenAmount, srcToken.decimals);
      const params: PriceInput = { srcToken, destToken, amount: srcWeiAmount, slippage };
      const price = await getCrossSwapPrice(params);
      if (price.status === SwapStatus.FAIL) {
        handleErrorPrice(price);
      } else {
        handleSuccessPrice(price, srcWeiAmount);
      }
      setIsLoading(false);
    }
  };

  const checkBalances = () => {
    if (
      srcToken?.chainId &&
      srcTokenAmount !== null &&
      srcTokenAmount > balances?.[srcToken.chainId]?.[srcToken?.address]
    ) {
      setError(t('insufficientBalance'));
    }
  };

  const handleSuccessPrice = (price: CrossSwapPrice, srcAmount: string) => {
    if (srcToken?.chainId && destToken?.chainId && account) {
      const humanAmount = convertFromWei(Number(price?.destTokenAmount), destToken.decimals);
      setDestTokenAmount(Number(humanAmount));

      checkApproved();
      checkBalances();

      dispatch(
        setLastParams({
          data: price.data,
          srcToken,
          destToken,
          srcAmount,
          connectorToken:
            connectorTokens[srcToken.chainId as Chain][usdcToken[srcToken.chainId as Chain].address].address,
          connectorTokenAmountOnSrcNetwork: price.connectorTokenAmountOnSrcNetwork,
          crossRoute: price.route,
          refundAddress: account, // TODO: once refund address will be added in UI pass that param here
          firstTxGasCostUSD: price.srcTxGasCostUSD,
          secondTxGasCostUSD: price.destTxGasCostUSD,
          destAmount: price.destTokenAmount,
          minDestAmount: price.minDestAmount,
          minConnectorTokenRefundAmount: price.minConnectorTokenRefundAmount,
        })
      );
    }
  };

  const handleErrorPrice = (price: CrossChainPriceError) => {
    setError(price.message);
  };

  const switchTokens = () => {
    if (!isLoading && srcToken && destToken) {
      batch(() => {
        dispatch(setSelectedTokenB(srcToken));
        dispatch(setSelectedTokenA(destToken));
      });
    }
  };

  const onLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
    setError('');
  };

  const onClick = async () => {
    setOpenCrossModal(true);
  };

  const getWidgetButtonText = () => {
    if (isWrongChain && srcToken?.chainId) {
      return tc('switchTo')([chains[srcToken.chainId as Chain].name]);
    }
    if (isApproving) {
      return t('pendingApprove');
    }
    if (isApproved) {
      return t('confirmSwap');
    }
    return tc('unlockToken')([srcToken?.symbol ?? '']);
  };

  const isSameTokensChain = srcToken?.chainId === destToken?.chainId;
  const isApproving = !!srcToken?.chainId && !!approves?.[srcToken?.chainId]?.[srcToken?.address];
  const isWrongChain = srcToken?.chainId !== chainId;

  return (
    <>
      <MetaTags
        title={'Cross-chain | bitoftrade'}
        description={'bitoftrade processes cross-chain swaps as two “swap & transfer” transactions on chosen networks.'}
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.com/trading/cross-chain`}
      />
      <div className={style.wrapper}>
        <Input
          value={srcTokenAmount}
          onChange={setSrcTokenAmount}
          onLoading={onLoading}
          token={srcToken}
          inputType={SelectTokenModal.FIRST_INPUT}
          balance={srcToken?.chainId ? balances[srcToken?.chainId]?.[srcToken?.address] : null}
          error={error}
        />
        <div className={style.wrapperButtonSwitch}>
          <ButtonSwitch onClick={switchTokens} disabled={isLoading} />
        </div>
        <Input
          disabled={true}
          value={destTokenAmount}
          token={destToken}
          inputType={SelectTokenModal.SECOND_INPUT}
          balance={destToken?.chainId ? balances[destToken?.chainId]?.[destToken?.address] : null}
          error={''}
        />
        <div className={style.warnings}>
          <Alert severity={'info'}>
            Please note that the current version of the app is in beta, with limited transaction volumes and supported
            chains.
          </Alert>
          {isSameTokensChain && srcToken && destToken && <SameChainError srcToken={srcToken} destToken={destToken} />}
          {account && !isSameTokensChain && srcToken?.chainId && srcToken?.chainId !== chainId && destToken && (
            <WrongChainError currentChainId={chainId} switchToChainId={srcToken?.chainId} />
          )}
        </div>
        <WidgetSendButton
          isLoading={isLoading}
          title={getWidgetButtonText()}
          onClick={onClick}
          disabled={isLoading || !!error || isSameTokensChain || isWrongChain || !srcTokenAmount}
        />
      </div>
      <Modal active={openCrossModal} setActive={setOpenCrossModal} className={style.modal}>
        {isApproving && srcToken?.chainId ? (
          <PendingApproveModal
            txHash={approves?.[srcToken?.chainId]?.[srcToken?.address]}
            chainId={srcToken?.chainId}
            symbol={srcToken?.symbol}
          />
        ) : (
          <CrossSwapModal
            approved={isApproved}
            setActive={setOpenCrossModal}
            active={openCrossModal}
            onConfirm={clearInputs}
          />
        )}
      </Modal>
    </>
  );
};

export default CrossChainWidget;
