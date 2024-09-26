import WalletIcon from '@/assets/icons/WalletIcon';
import style from './SwapTrade.module.css';
import ButtonSwitch from '@/components/ButtonSwitch/ButtonSwitch';
import Clarification from '@/components/Clarification/Clarification';
import { DebounceInput } from '@/components/DebounceInput/DebounceInput';
import Modal from '@/components/Modal/Modal';
import useMultilingual from '@/hooks/useMultilingual';
import { balancesSelector } from '@/redux/appSlice';
import { calcSwapPrice, updatePriceRoute } from '@/redux/helpers/calcSwapPrice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { setSelectedTokenB, setSelectedTokenA, setSelectTokenModal, SelectTokenModal } from '@/redux/widgetSlice';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { batch } from 'react-redux';
import WidgetSelectButton from '../WidgetSelectButton/WidgetSelectButton';
import WidgetSendButton from '../WidgetSendButton/WidgetSendButton';
import useState from 'react-usestateref';
import SwapModal from './SwapModal/SwapModal';
import { setIsLoading } from '@/redux/swapSlice';
import { setBuyAmount, setSellAmount } from '@/redux/swapSlice';
import { chains } from 'connection/chainConfig';
import { getAllowance } from '@/common/web3/Web3Manager';
import { CheckDollarTokens } from '@/helpers/CheckDollarTokens';
import { PROXY_APPROVE_ADDRESSES, Exchanges } from '@/common/constants';
import MetaTags from '@/components/MetaTags/MetaTags';
import getDecimalsScale from '@/helpers/getDecimalsScale';
import PendingApproveModal from '../ApproveModal/PendingApproveModal';

const SwapTrade = () => {
  const { t, tc } = useMultilingual('widget');
  const { c } = useMultilingual('swapWidgetTooltip');
  const { tc: tcMetadata } = useMultilingual('tradingMetadata');
  const { account } = useWeb3React();

  const dispatch = useAppDispatch();
  const tokenA = useAppSelector(({ widget }) => widget.selectedTokenA);
  const balances = useAppSelector(balancesSelector);
  const chainId = useAppSelector(({ app }) => app.chainId);
  const tokenB = useAppSelector(({ widget }) => widget.selectedTokenB);
  const approves = useAppSelector(({ swap }) => swap.pendingApproveHashes);
  const priceRoute = useAppSelector(({ swap }) => swap.priceRoute);
  const sellValue = useAppSelector(({ swap }) => swap.sellAmount);
  const buyValue = useAppSelector(({ swap }) => swap.buyAmount);
  const isLoading = useAppSelector(({ swap }) => swap.isLoading);

  const [errorFirst, setErrorFirst] = useState<string>('');
  const [errorSecond, setErrorSecond] = useState<string>('');
  const [tokenAllowance, setTokenAllowance] = useState<number>(0);
  const [isActiveModal, setIsActiveModal] = useState<boolean>(false);

  const handleValueChange = async (amount: number | null, isBuy: boolean) => {
    if (amount !== null) {
      dispatch(isBuy ? setBuyAmount(amount) : setSellAmount(amount));
      if (amount) await updateSwapPrice(isBuy, amount);
    } else {
      clearInputs(amount, isBuy);
    }
  };

  const onSellChange = (amount: number | null) => handleValueChange(amount, false);
  const onBuyChange = (amount: number | null) => handleValueChange(amount, true);

  const clearInputs = (amount?: number | null, isBuy?: boolean) => {
    setErrorFirst('');
    setErrorSecond('');
    dispatch(setBuyAmount(isBuy ? amount ?? null : null));
    dispatch(setSellAmount(!isBuy ? amount ?? null : null));
    dispatch(setIsLoading(false));
  };

  const updateSwapPrice = async (isBuy: boolean, amount: number) => {
    setErrorFirst('');
    setErrorSecond('');
    dispatch(setIsLoading(true));

    const response = await calcSwapPrice(isBuy, amount);
    if (response.error) {
      const error = t('defaultErrorMessage');
      isBuy ? setErrorSecond(error) : setErrorFirst(error);
    } else {
      const amount = response.value;
      dispatch(!isBuy ? setBuyAmount(amount) : setSellAmount(amount));
    }

    checkBalances(isBuy ? response.value : amount);
    dispatch(setIsLoading(false));
  };

  const checkBalances = (amount: number) => {
    if (tokenA?.address) {
      const balance = Number(balances[tokenA.address]);
      if (amount > balance) {
        setErrorFirst(t('insufficientBalance'));
      }
    }
  };

  const switchTokens = () => {
    if (tokenA && tokenB) {
      batch(() => {
        dispatch(setSelectedTokenB(tokenA));
        dispatch(setSelectedTokenA(tokenB));
      });
    }
  };

  const send = async () => {
    setIsActiveModal(true);
  };

  const updateAllowance = async () => {
    if (account && tokenA && tokenA?.address !== chains[chainId].nativeToken.address) {
      const allowanceInfo = {
        clientAddress: account,
        allowanceTo: PROXY_APPROVE_ADDRESSES[Exchanges.PARASWAP],
        token: tokenA.address,
        chainId,
        decimals: tokenA.decimals,
      };
      const allowance = await getAllowance(allowanceInfo);
      setTokenAllowance(allowance);
    }
  };

  useEffect(() => {
    const priceRouteUpdater = setInterval(updatePriceRoute, 5000);
    return () => clearInterval(priceRouteUpdater);
  }, []);

  useEffect(() => {
    if (tokenA && tokenB) {
      if (sellValue) updateSwapPrice(false, sellValue);
      else if (buyValue) updateSwapPrice(true, buyValue);
    }
  }, [tokenA, tokenB, balances]);

  useEffect(() => {
    updateAllowance();
  }, [account, tokenA, approves]);

  useEffect(() => {
    setIsActiveModal(false);
  }, [chainId]);

  // close pending approve modal when approve is done
  useEffect(() => {
    if (tokenA?.address && !approves?.[chainId]?.[tokenA?.address]) {
      setIsActiveModal(false);
    }
  }, [approves]);

  const systemGasFee = Number(priceRoute?.gasCostUSD ?? 0);
  const isApproved =
    tokenA?.address === chains[chainId].nativeToken.address || sellValue === null || tokenAllowance >= sellValue;
  const isApproving = tokenA?.address && !!approves?.[chainId]?.[tokenA?.address];

  return (
    <>
      <MetaTags
        title={tcMetadata('swapTitle')([tokenA?.symbol ?? '', tokenB?.symbol ?? ''])}
        description={tcMetadata('swapDescription')([tokenA?.symbol ?? '', tokenB?.symbol ?? ''])}
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.come/trading`}
      />

      <div className={style.wrapper}>
        <div className={style.grid}>
          <div className={style.cell}>
            <div className={style.label}>
              <span className={style.text}>{t('pay')}</span>
              <Clarification size={17} helperText={c('youPay')} stroke="var(--secondaryFont)" />
            </div>
            <WidgetSelectButton
              coinName={tokenA?.symbol ?? ''}
              onClick={() => dispatch(setSelectTokenModal(SelectTokenModal.FIRST_INPUT))}
            />
          </div>
          <div>
            <div className={`${style.label} ${style.positionLeft}`}>
              <span className={style.balance}>
                <NumberFormat
                  decimalScale={tokenA?.address ? getDecimalsScale(balances[tokenA?.address]) : 4}
                  thousandSeparator
                  displayType="text"
                  value={tokenA?.address ? balances[tokenA?.address] : null}
                />{' '}
                {tokenA?.symbol}
              </span>
              <WalletIcon />
            </div>
            <DebounceInput
              value={sellValue}
              onChange={onSellChange}
              error={errorFirst}
              decimalScale={tokenA?.symbol && CheckDollarTokens(tokenA?.symbol) ? 2 : 6}
              debounceInterval={700}
              setLoading={() => dispatch(setIsLoading(true))}
            />
          </div>
        </div>
        <div className={style.wrapperButtonSwitch}>
          <ButtonSwitch onClick={switchTokens} />
        </div>
        <div className={style.grid}>
          <div className={style.cell}>
            <div className={style.label}>
              <span className={style.text}>{t('receive')}</span>
              <Clarification size={17} helperText={c('youReceive')} stroke="var(--secondaryFont)" />
            </div>
            <WidgetSelectButton
              coinName={tokenB?.symbol ?? ''}
              onClick={() => dispatch(setSelectTokenModal(SelectTokenModal.SECOND_INPUT))}
            />
          </div>
          <div>
            <div className={`${style.label} ${style.positionLeft}`}>
              <span className={style.balance}>
                <NumberFormat
                  decimalScale={tokenB?.address ? getDecimalsScale(balances[tokenB?.address]) : 4}
                  thousandSeparator
                  displayType="text"
                  value={tokenB?.address ? balances[tokenB?.address] : null}
                />{' '}
                {tokenB?.symbol}
              </span>
              <WalletIcon />
            </div>
            <DebounceInput
              value={buyValue}
              onChange={onBuyChange}
              error={errorSecond}
              decimalScale={tokenB?.symbol && CheckDollarTokens(tokenB?.symbol) ? 2 : 6}
              debounceInterval={700}
              setLoading={() => dispatch(setIsLoading(true))}
            />
          </div>
        </div>
        <div className={style.details}>
          <span>{t('transactionDetails')}</span>
          <div>
            <div className={style.slippage}>
              <div className={style.detail}>
                <span className={style.detailTitle}>{t('slippage')}</span>
                <Clarification size={17} helperText={c('slippage')} stroke="var(--secondaryFont)" />
              </div>
              <NumberFormat thousandSeparator displayType="text" value={1} suffix="%" />
            </div>
            <div className={style.gasfees}>
              <div className={style.detail}>
                <span className={style.detailTitle}> {t('gasFee')} </span>{' '}
                <Clarification size={17} helperText={c('estimate')} stroke="var(--secondaryFont)" />
              </div>
              <NumberFormat decimalScale={2} thousandSeparator displayType="text" value={systemGasFee} prefix="$" />
            </div>
          </div>
        </div>
      </div>
      <WidgetSendButton
        isLoading={isLoading}
        title={
          isApproving ? t('pendingApprove') : isApproved ? t('confirmSwap') : tc('unlockToken')([tokenA?.symbol ?? ''])
        }
        onClick={send}
        disabled={!!errorFirst || !!errorSecond || !!isLoading || !sellValue || !buyValue}
      />
      <Modal active={isActiveModal} setActive={setIsActiveModal}>
        {isApproving ? (
          <PendingApproveModal
            txHash={approves?.[chainId]?.[tokenA?.address]}
            chainId={chainId}
            symbol={tokenA?.symbol}
          />
        ) : (
          <SwapModal
            approved={isApproved}
            setActive={setIsActiveModal}
            active={isActiveModal}
            onConfirm={clearInputs}
          />
        )}
      </Modal>
    </>
  );
};

export default SwapTrade;
