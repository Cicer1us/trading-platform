import style from './Input.module.css';
import Clarification from '@/components/Clarification/Clarification';
import useMultilingual from '@/hooks/useMultilingual';
import React from 'react';
import WidgetSelectButton from 'pagesContent/Trading/Widget/WidgetSelectButton/WidgetSelectButton';
import { Token } from '@/interfaces/Tokens.interface';
import { SelectTokenModal, setSelectTokenModal } from '@/redux/widgetSlice';
import { useAppDispatch } from '@/redux/hooks/reduxHooks';
import { DebounceInput } from '@/components/DebounceInput/DebounceInput';
import WalletIcon from '@/assets/icons/WalletIcon';
import NumberFormat from 'react-number-format';
import { CheckDollarTokens } from '@/helpers/CheckDollarTokens';

interface IInput {
  token: Token | null;
  inputType: SelectTokenModal;
  value: number | null;
  onChange?: (a: any) => void;
  onLoading?: (a: any) => void;
  balance: number | null;
  error: string;
  disabled?: boolean;
}
const Input: React.FC<IInput> = ({
  token,
  inputType,
  value,
  onChange = () => {},
  onLoading,
  balance,
  error,
  disabled,
}: IInput): JSX.Element => {
  const { t } = useMultilingual('widget');
  const { c } = useMultilingual('swapWidgetTooltip');
  const dispatch = useAppDispatch();
  return (
    <>
      <div className={style.grid}>
        <div className={style.cell}>
          <div className={style.label}>
            <span className={style.text}>{inputType === SelectTokenModal.FIRST_INPUT ? t('pay') : t('receive')}</span>
            <Clarification
              size={17}
              helperText={inputType === SelectTokenModal.FIRST_INPUT ? c('youPay') : c('youReceive')}
              stroke="var(--secondaryFont)"
            />
            <div className={style.balance}>
              <span>
                <NumberFormat
                  decimalScale={token?.symbol && CheckDollarTokens(token?.symbol) ? 2 : 6}
                  thousandSeparator
                  displayType="text"
                  value={balance}
                />{' '}
                {token?.symbol}
              </span>
              <WalletIcon />
            </div>
          </div>
          <DebounceInput
            disabled={disabled}
            onChange={onChange}
            setLoading={onLoading}
            value={value}
            decimalScale={token?.symbol && CheckDollarTokens(token?.symbol) ? 2 : 6}
            debounceInterval={1000}
            error={error}
          />
        </div>
        <div className={style.selectionWrapper}>
          <WidgetSelectButton
            chainId={token?.chainId}
            coinName={token?.symbol ?? ''}
            onClick={() => dispatch(setSelectTokenModal(inputType))}
            size="small"
            coinSize="18px"
          />
        </div>
      </div>
    </>
  );
};
export default Input;
