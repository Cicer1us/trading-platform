import React, { useState, useEffect } from 'react';
import style from './LimitTrade.module.css';
import ButtonSwitch from '@/components/ButtonSwitch/ButtonSwitch';
import { NumberInput } from '@/components/Inputs/Inputs';
import Clarification from '@/components/Clarification/Clarification';
import WalletIcon from '@/icons/WalletIcon';
import NumberFormat from 'react-number-format';
import Select, { Option } from '@/components/Select/Select';
import WidgetSelectButton from '../WidgetSelectButton/WidgetSelectButton';
import WidgetSendButton from '../WidgetSendButton/WidgetSendButton';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { calcLimitPrice } from '@/redux/helpers/calcLimitPrice';
import { batch } from 'react-redux';
import LimitModal from './LimitModal/LimitModal';
import Modal from '@/components/Modal/Modal';
import useMultilingual from '@/hooks/useMultilingual';
import { analyticsLimitSubmit } from 'analytics/analytics';
import { SelectTokenModal, setSelectedTokenA, setSelectedTokenB, setSelectTokenModal } from '@/redux/widgetSlice';
import { useWeb3React } from '@web3-react/core';
import { getAllowance } from '@/common/web3/Web3Manager';
import { balancesSelector } from '@/redux/appSlice';
import { Chains } from 'connection/chainConfig';
import { DebounceInput } from '@/components/DebounceInput/DebounceInput';
import { CheckDollarTokens } from '@/helpers/CheckDollarTokens';
import { ChainId, getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import MetaTags from '@/components/MetaTags/MetaTags';
import PendingApproveModal from '../ApproveModal/PendingApproveModal';

const options: Array<Option> = [
  { value: '1', title: '1 day' },
  { value: '3', title: '3 days' },
  { value: '5', title: '5 days' },
  { value: '7', title: '7 days' },
  { value: '10', title: '10 days' },
];

const LimitTrade = (): JSX.Element => {
  const { t, tc } = useMultilingual('widget');
  const { c } = useMultilingual('limitWidgetTooltip');
  const { t: tMetadata, tc: tcMetadata } = useMultilingual('tradingMetadata');

  const dispatch = useAppDispatch();
  const tokenA = useAppSelector(({ widget }) => widget.selectedTokenA);
  const chainId = useAppSelector(({ app }) => app.chainId);
  const tokenB = useAppSelector(({ widget }) => widget.selectedTokenB);

  const [valueFirst, setValueFirst] = useState<number>(null);
  const [valueSecond, setValueSecond] = useState<number>(null);
  const [valuePeriod, setValuePeriod] = useState<string>(options[0].value);
  const [errorFirst, setErrorFirst] = useState<string>('');
  const [valuePrice, setValuePrice] = useState<number>(null);
  const balances = useAppSelector(balancesSelector);
  const approves = useAppSelector(({ limit }) => limit.pendingApproveHashes);
  const [isActiveModal, setIsActiveModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenAllowance, setTokenAllowance] = useState<number>(0);

  const { account } = useWeb3React();

  const updateLimitPrice = async (amount: number) => {
    setIsLoading(true);
    setErrorFirst('');
    if (amount) {
      const response = await calcLimitPrice(amount, Chains.MAINNET.toString());
      const error = response.error;
      if (error) {
        setErrorFirst(t('defaultErrorMessage'));
        setValuePrice(null);
        setValueSecond(null);
      } else {
        setValueSecond(response.value);
        setValuePrice(response.price);
      }
      setIsLoading(false);
    }
  };

  const onValuePriceChange = async (amount = 0) => {
    const updatedSecondValue = amount * valueFirst;
    setValuePrice(amount);
    setValueSecond(updatedSecondValue);
  };

  const onValueFirstChange = async (amount: number) => {
    if (amount) {
      setValueFirst(amount);
      await updateLimitPrice(amount);
    } else {
      clearInputs();
    }
  };

  const clearInputs = () => {
    setValueFirst(null);
    setValuePrice(null);
    setValueSecond(null);
    setIsLoading(false);
  };

  const send = async () => {
    analyticsLimitSubmit(tokenA.symbol, tokenB.symbol, account, chainId);
    setIsActiveModal(true);
  };

  const switchTokens = () => {
    batch(() => {
      dispatch(setSelectedTokenA(tokenB));
      dispatch(setSelectedTokenB(tokenA));
    });
  };

  const updateAllowance = async () => {
    if (account) {
      const allowanceTo = getContractAddressesForChainOrThrow(Number(chainId) as ChainId).exchangeProxy;
      const allowanceInfo = {
        clientAddress: account,
        allowanceTo,
        token: tokenA.address,
        chainId,
        decimals: tokenA.decimals,
      };
      const allowance = await getAllowance(allowanceInfo);
      setTokenAllowance(allowance);
    }
  };

  useEffect(() => {
    const updatePrice = async (amount: number) => await updateLimitPrice(amount);
    if (valueFirst) updatePrice(valueFirst);
  }, [tokenA, tokenB]);

  useEffect(() => {
    updateAllowance();
  }, [account, tokenA, approves]);

  useEffect(() => {
    setIsActiveModal(false);
  }, [chainId]);

  const isApproved = tokenAllowance > valueFirst;
  const isApproving = !!approves?.[chainId]?.[tokenA?.address];

  return (
    <>
      <MetaTags
        title={tcMetadata('limitTitle')([tokenA?.symbol, tokenB?.symbol])}
        description={tMetadata('limitDescription')}
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.come/trading`}
      />

      <div className={style.wrapper}>
        <div className={style.grid}>
          <div className={style.cell}>
            <div className={style.label}>
              <span className={style.text}>{t('payLimit')}</span>
              <Clarification size={17} helperText={c('pay')} stroke="var(--secondaryFont)" />
            </div>
            <WidgetSelectButton
              coinName={tokenA?.symbol}
              onClick={() => dispatch(setSelectTokenModal(SelectTokenModal.FIRST_INPUT))}
            />
          </div>
          <div>
            <div className={`${style.label} ${style.positionLeft}`}>
              <span className={style.balance}>
                <NumberFormat
                  decimalScale={CheckDollarTokens(tokenA?.symbol) ? 2 : 4}
                  thousandSeparator
                  displayType="text"
                  value={balances[tokenA?.address]}
                />{' '}
                {tokenA?.symbol}
              </span>
              <WalletIcon />
            </div>
            <DebounceInput
              value={valueFirst}
              onChange={onValueFirstChange}
              error={errorFirst}
              decimalScale={CheckDollarTokens(tokenA?.symbol) ? 2 : 6}
              debounceInterval={700}
              setLoading={() => setIsLoading(true)}
            />
          </div>
        </div>
        <div className={style.grid}>
          <div className={style.cell}>
            <div className={style.label}>
              <span className={style.text}>{t('period')}</span>
              <Clarification size={17} helperText={c('range')} stroke="var(--secondaryFont)" />
            </div>
            <Select options={options} handlerSelected={value => setValuePeriod(value)} selectedValue={valuePeriod} />
          </div>
          <div>
            <div className={style.label}>
              <span className={style.text}>{t('priceLimit')}</span>
              <Clarification size={17} helperText={c('priceLimit')} stroke="var(--secondaryFont)" />
            </div>
            <NumberInput maxLength={14} value={valuePrice} onChange={onValuePriceChange} decimalScale={6} />
          </div>
        </div>
        <div className={style.wrapperButtonSwitch}>
          <ButtonSwitch onClick={switchTokens} />
        </div>
        <div className={`${style.grid} ${style.marginBottom}`}>
          <div className={style.cell}>
            <div className={style.label}>
              <span className={style.text}>{t('receiveLimit')}</span>
              <Clarification size={17} helperText={c('receive')} stroke="var(--secondaryFont)" />
            </div>
            <WidgetSelectButton
              coinName={tokenB?.symbol}
              onClick={() => dispatch(setSelectTokenModal(SelectTokenModal.SECOND_INPUT))}
            />
          </div>
          <div>
            <div className={`${style.label} ${style.positionLeft}`}>
              <span className={style.balance}>
                <NumberFormat
                  decimalScale={CheckDollarTokens(tokenB?.symbol) ? 2 : 4}
                  thousandSeparator
                  displayType="text"
                  value={balances[tokenB?.address]}
                />{' '}
                {tokenB?.symbol}
              </span>
              <WalletIcon />
            </div>
            <NumberInput
              maxLength={18}
              onChange={() => null}
              decimalScale={CheckDollarTokens(tokenB.symbol) ? 2 : 6}
              value={valueSecond}
              disabled={true}
            />
          </div>
        </div>
      </div>
      <WidgetSendButton
        isLoading={isLoading}
        title={isApproving ? t('pendingApprove') : isApproved ? t('confirmLimit') : tc('unlockToken')([tokenA?.symbol])}
        onClick={send}
        disabled={
          !!errorFirst || !!isLoading || !valueFirst || !valueSecond || !valuePrice || chainId !== Chains.MAINNET
        }
      />

      <Modal active={isActiveModal} setActive={setIsActiveModal}>
        {isApproving ? (
          <PendingApproveModal
            txHash={approves?.[chainId]?.[tokenA?.address]}
            chainId={chainId}
            symbol={tokenA?.symbol}
          />
        ) : (
          <LimitModal
            onConfirm={clearInputs}
            chainId={chainId}
            active={isActiveModal}
            setActive={setIsActiveModal}
            valueFirst={valueFirst}
            valueSecond={valueSecond}
            valuePeriod={Number(valuePeriod)}
            approved={isApproved}
          />
        )}
      </Modal>
    </>
  );
};

export default React.memo(LimitTrade);
