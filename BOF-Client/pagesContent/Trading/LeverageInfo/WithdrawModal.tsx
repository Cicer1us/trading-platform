import { InputWithCoinIcon } from '@/components/Inputs/InputWithCoinIcon';
import { BASIC_LEVERAGE_TOKEN } from '@/common/LeverageTradeConstants';
import React, { useState } from 'react';
import buttonStyle from '../Widget/WidgetSendButton/WidgetSendButton.module.css';
import style from './DepositWithdraw.module.css';
import Clarification from '@/components/Clarification/Clarification';
import NumberFormat from 'react-number-format';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import useMultilingual from '@/hooks/useMultilingual';
import { clientManager } from '@/common/DydxClientManager';
import createTransfer from '../../../API/leverageTransfer/createTransfer';
import { TransferOperation } from '../../../API/leverageTransfer/LeverageTransfer.interfaces';
import { ClipLoader } from 'react-spinners';
import { useWeb3React } from '@web3-react/core';
import { TransferAsset } from '@dydxprotocol/v3-client';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';
import { getDydxApiHost } from '@/helpers/leverageTrade/constants';
import { Chains } from 'connection/chainConfig';
import { Alert } from '@/components/Alert/Alert';

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WithdrawModal: React.FC<Props> = ({ setActive }) => {
  const { t } = useMultilingual('widget');

  const { account: clientAddress, chainId } = useWeb3React();
  const freeCollateral =
    chainId === Chains.GOERLI ? 0 : useAppSelector(({ dydxData }) => Number(dydxData?.account?.freeCollateral));
  const account = useAppSelector(({ dydxData }) => dydxData.account);
  const [withdrawValue, setWithdrawValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [liquidityProviderInfo, setLiquidityProviderInfo] = useState<any>(null);
  const [fee, setFee] = useState(0);
  const [error, setError] = useState(null);
  const withdrawDisabled = chainId === Chains.GOERLI;

  const withdrawAmountOnChange = async (value: number, maxAmount = false) => {
    if (withdrawDisabled) {
      return;
    }
    setWithdrawValue(value.toString());
    if (value > freeCollateral) {
      setError('Entered amount exceeds you current balance. (Only free assets available for withdraw)');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const liquidityProviderInfo = await getWithdrawQuote(value.toString());
      const debit = Number(liquidityProviderInfo.quote.debitAmount);
      const credit = Number(liquidityProviderInfo.quote.creditAmount);
      maxAmount ? setWithdrawValue(liquidityProviderInfo.quote.debitAmount) : '';
      setLiquidityProviderInfo(liquidityProviderInfo);
      const fee = debit - credit;
      if (credit > 0) {
        setFee(fee);
      } else {
        setFee(0);
        setError(`Based on current withdraw fees minimum sum to withdraw is ${fee.toFixed(2)}`);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const getWithdrawQuote = async (withdrawValue: string) => {
    const url = `${getDydxApiHost(chainId)}/v3/fast-withdrawals?${new URLSearchParams({
      creditAsset: TransferAsset.USDC,
      debitAmount: withdrawValue,
    }).toString()}`;

    const response = await (
      await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    ).json();
    return response?.liquidityProviders?.['2'];
  };

  const withdrawUSDC = async () => {
    setIsLoading(true);
    try {
      await clientManager.client.private.createFastWithdrawal(
        {
          creditAmount: liquidityProviderInfo.quote.creditAmount,
          creditAsset: liquidityProviderInfo.quote.creditAsset,
          debitAmount: liquidityProviderInfo.quote.debitAmount,
          lpPositionId: '2',
          lpStarkKey: liquidityProviderInfo.starkKey,
          toAddress: clientAddress,
          expiration: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        },
        account.positionId
      );
      await createTransfer({ operation: TransferOperation.WITHDRAWAL, amount: Number(withdrawValue) }).then();
    } catch (error) {
      console.error(error);
      Notify({ state: NotifyEnum.ERROR, title: t('withdrawal'), message: t('failureText') });
    } finally {
      setWithdrawValue('');
      setIsLoading(false);
      setActive(false);
    }
  };

  return (
    <>
      <p className={style.title}>{t('withdraw')}</p>
      <div className={style.helpTextWrapper}>
        <div className={style.label}>
          <span className={style.text}>Available balance</span>
          <Clarification size={17} helperText={t('withdrawAsseHelper')} stroke="var(--secondaryFont)" />
        </div>
        <div className={`${style.label} ${style.positionLeft} `}>
          <span className={style.balance}>
            <NumberFormat
              thousandSeparator
              displayType="text"
              value={freeCollateral.toFixed(2)}
              suffix={` ${BASIC_LEVERAGE_TOKEN}`}
            />
          </span>
        </div>
      </div>

      <div className={style.helpTextWrapper}>
        <div className={style.label}>
          <span className={style.text}>{t('fee')}</span>
        </div>
        <div className={`${style.label} ${style.positionLeft} `}>
          <span className={style.balance}>
            <NumberFormat
              thousandSeparator
              displayType="text"
              value={fee.toFixed(2)}
              suffix={` ${BASIC_LEVERAGE_TOKEN}`}
            />
          </span>
        </div>
      </div>
      <InputWithCoinIcon
        value={withdrawValue}
        decimalScale={2}
        onChange={value => withdrawAmountOnChange(Number(value))}
        coinName={BASIC_LEVERAGE_TOKEN}
        placeholder="0"
        coinSymbol={BASIC_LEVERAGE_TOKEN}
        enableMaxButton={true}
        maxButtonOnClick={() => withdrawAmountOnChange(freeCollateral)}
        disabled={withdrawDisabled}
        wrapperStyles={withdrawDisabled ? style.disableMouseEvents : ''}
      />

      {error ? (
        <div className={style.alertWrapper}>
          <Alert severity={'error'}>{error}</Alert>
        </div>
      ) : (
        <div className={style.alertWrapper}>
          <Alert severity={'info'}>{t('withdrawAlertMsg')}</Alert>
        </div>
      )}

      <div className={`${style.buttonWrapper} ${isLoading || Number(withdrawValue) <= 0 ? style.notAllowed : ''}`}>
        <button
          disabled={error || isLoading || Number(withdrawValue) <= 0 || withdrawDisabled}
          type="button"
          onClick={() => withdrawUSDC()}
          className={`${buttonStyle.button} ${buttonStyle.connect}`}
        >
          Confirm Withdraw{' '}
          {isLoading && (
            <div className={style.loaderWrapper}>
              {/*<ScaleLoader height={20} width={2} radius={1} margin={1} color={'var(--green)'} />*/}
              <ClipLoader size={30} color={'var(--green)'} />
            </div>
          )}
        </button>
      </div>
    </>
  );
};
