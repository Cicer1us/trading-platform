import { InputWithCoinIcon } from '@/components/Inputs/InputWithCoinIcon';
import { BASIC_LEVERAGE_TOKEN, BASIC_LEVERAGE_TOKEN_ADDRESS } from '@/common/LeverageTradeConstants';
import React, { useState } from 'react';
import buttonStyle from '../Widget/WidgetSendButton/WidgetSendButton.module.css';
import style from './DepositWithdraw.module.css';
import Clarification from '@/components/Clarification/Clarification';
import NumberFormat from 'react-number-format';
import WalletIcon from '@/icons/WalletIcon';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { Chains } from 'connection/chainConfig';
import useMultilingual from '@/hooks/useMultilingual';
import { useWeb3React } from '@web3-react/core';
import { depositUSDC } from './deposit';
import { ClipLoader } from 'react-spinners';
import { Alert } from '@/components/Alert/Alert';
import {
  depositTxConfirmed,
  depositTxSubmitted,
  someThingWentWrong,
} from '../Widget/LeverageTrade/LeverageNotifications';
import { updateBalances } from '@/redux/appSlice';
import { useDispatch } from 'react-redux';
import { setDepositTx } from '@/redux/dydxDataSlice';

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const calculateMaxValue = (balance: number): number => {
  const decimalsIndex = balance?.toString().indexOf('.') + 3;
  const maxDeposit = balance?.toString().substr(0, decimalsIndex);
  return Number(maxDeposit);
};

export const DepositModal: React.FC<Props> = ({ setActive }) => {
  const { t } = useMultilingual('widget');
  const dispatch = useDispatch();

  const { account: clientAddress, chainId } = useWeb3React();
  const usdcBalance = useAppSelector(({ app }) =>
    calculateMaxValue(app.balances[chainId][BASIC_LEVERAGE_TOKEN_ADDRESS])
  );
  const userPublicStarkKey = useAppSelector(({ dydxAuth }) => dydxAuth.starkPrivateKey?.publicKey);
  const positionId = useAppSelector(({ dydxData }) => dydxData.account?.positionId);
  const [depositValue, setDepositValue] = useState<number | string>(chainId === Chains.GOERLI ? 2000 : '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputDisabled = chainId === Chains.GOERLI || isLoading;
  const submittedNotification = depositTxSubmitted;
  const confirmedNotification = depositTxConfirmed;
  const someThingWentWrongNotification = someThingWentWrong;

  const maxOnClick = () => {
    setDepositValue(usdcBalance);
  };

  const makeDeposit = async () => {
    setIsLoading(true);
    try {
      const txResult = await depositUSDC({
        clientAddress,
        chainId,
        userPublicStarkKey,
        positionId,
        depositValue,
      });

      submittedNotification(chainId, txResult.transactionHash, t);
      txResult.confirmation.then(
        res => {
          if (res.transactionHash) {
            setDepositValue('');
            setIsLoading(false);
            setActive(false);
            confirmedNotification(chainId, res.transactionHash, t);
            dispatch(setDepositTx(res.transactionHash));
            dispatch(updateBalances());
          }
        },
        reason => {
          console.error('deposit failed', reason);
          setIsLoading(false);
          someThingWentWrongNotification(t);
        }
      );
    } catch (e) {
      console.error(e);
      setDepositValue('');
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className={style.title}>{t('deposit')}</p>
      <div className={style.helpTextWrapper}>
        <div className={style.label}>
          <span className={style.text}>Asset</span>
          <Clarification size={17} helperText={t('depositAssetHelper')} stroke="var(--secondaryFont)" />
        </div>
        <div className={`${style.label} ${style.positionLeft}`}>
          <span className={style.balance}>
            <NumberFormat
              thousandSeparator
              displayType="text"
              value={usdcBalance ? usdcBalance.toFixed(2) : '0'}
              suffix={` ${BASIC_LEVERAGE_TOKEN}`}
            />
          </span>
          <WalletIcon />
        </div>
      </div>
      <InputWithCoinIcon
        value={depositValue}
        decimalScale={2}
        onChange={value => setDepositValue(Number(value))}
        coinName={BASIC_LEVERAGE_TOKEN}
        placeholder="0"
        coinSymbol={BASIC_LEVERAGE_TOKEN}
        enableMaxButton={true}
        disabled={inputDisabled}
        maxButtonOnClick={maxOnClick}
        wrapperStyles={inputDisabled ? style.disableMouseEvents : ''}
      />
      <div className={style.alertWrapper}>
        <Alert severity={'warning'}>{t('depositAlertMsg')}</Alert>
      </div>
      <div className={`${style.buttonWrapper} ${isLoading || depositValue <= 0 ? style.notAllowed : ''}`}>
        <button
          disabled={isLoading || depositValue <= 0 || (chainId === Chains.MAINNET && depositValue > usdcBalance)}
          type="button"
          onClick={() => makeDeposit()}
          className={`${buttonStyle.button} ${buttonStyle.connect}`}
        >
          {t('confirmDeposit')}
          {isLoading && (
            <div className={style.loaderWrapper}>
              <ClipLoader size={30} color={'var(--green)'} />
            </div>
          )}
        </button>
      </div>
    </>
  );
};
