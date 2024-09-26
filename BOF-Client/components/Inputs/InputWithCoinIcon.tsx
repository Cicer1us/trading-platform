import React from 'react';
import style from '@/components/Inputs/Inputs.module.css';
import NumberFormat from 'react-number-format';
import { IInputCoin } from '@/components/Inputs/Inputs';
import { LeverageMarketIcon } from '@/assets/icons/leverage/LeverageMarketIcon';

interface IInputWithCoinIcon extends IInputCoin {
  coinSymbol?: string;
  decimalScale: number;
  enableMaxButton?: boolean;
  disableIcon?: boolean;
  maxButtonOnClick?: () => void;
  wrapperStyles?: string;
  prefixElement?: JSX.Element;
}

export const InputWithCoinIcon: React.FC<IInputWithCoinIcon> = ({
  onChange,
  onFocus,
  onBlur,
  value,
  placeholder = '',
  disabled = false,
  coinName,
  coinSymbol,
  decimalScale,
  maxLength = 12,
  enableMaxButton,
  maxButtonOnClick,
  wrapperStyles,
  prefixElement,
}): JSX.Element => {
  const handleValue = ({ floatValue }) => {
    // to prevent invoking onChange for rounded value
    onChange(floatValue);
  };

  return (
    <div
      className={`${style.wrapperInputCoin} ${style.wrapperInput} ${style.wrapperInputWithCoinIcon} ${
        disabled ? style.noHover : ''
      } ${wrapperStyles ?? ''}`}
    >
      <NumberFormat
        decimalScale={decimalScale}
        displayType={disabled ? 'text' : 'input'}
        className={style.input}
        value={value ?? ''}
        onFocus={onFocus}
        onBlur={onBlur}
        thousandSeparator={true}
        allowNegative={false}
        onValueChange={handleValue}
        placeholder={placeholder.toString()}
        maxLength={maxLength}
        disabled={disabled}
        isAllowed={values => {
          return values.value !== '00';
        }}
      />
      <div className={style.coinIconWrapper}>
        <>
          {coinName && <span>{coinName}</span>}
          {coinSymbol && <LeverageMarketIcon size={32} market={coinSymbol} />}
        </>
        {prefixElement}
        {enableMaxButton && (
          <div className={style.maxButton} onClick={maxButtonOnClick}>
            MAX
          </div>
        )}
      </div>
    </div>
  );
};
