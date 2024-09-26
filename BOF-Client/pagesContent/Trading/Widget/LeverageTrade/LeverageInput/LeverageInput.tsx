import * as React from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import style from './LeverageInput.module.css';

type InputType = 'password' | 'text' | 'email' | 'number';

interface IInput {
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } } | number) => void;
  onValueChange?: (values: NumberFormatValues) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  type?: InputType;
  value: number | string;
  state?: string;
  error?: string;
  placeholder?: string;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
  decimalScale?: number;
  maxLength?: number;
}

export interface IInputCoin extends IInput {
  coinName?: string;
  disabled?: boolean;
  thousandSeparator?: boolean;
  inputSuffix?: string;
  onChange: (value: number) => void;
}

const LeverageInput: React.FC<IInputCoin> = ({
  onChange,
  onFocus,
  onBlur,
  value,
  error,
  placeholder = '',
  inputSuffix,
  disabled = false,
  decimalScale = 2,
  maxLength = 12,
}): JSX.Element => {
  const handleValue = ({ floatValue }) => {
    // to prevent invoking onChange for rounded value
    if (Number(value)?.toFixed(decimalScale) !== floatValue) onChange(floatValue);
  };

  return (
    <div className={`${style.wrapperInputCoin} ${error ? style.error : ''}`}>
      <div className={style.wrapperInput}>
        <NumberFormat
          decimalScale={decimalScale}
          displayType={disabled ? 'text' : 'input'}
          className={style.input}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          thousandSeparator={true}
          allowNegative={false}
          onValueChange={handleValue}
          suffix={inputSuffix}
          placeholder={placeholder}
          allowLeadingZeros={false}
          maxLength={maxLength}
          isAllowed={values => {
            return values.value !== '00';
          }}
        />
        {error && <small className={style.errorText}>{error}</small>}
      </div>
    </div>
  );
};

export default LeverageInput;
