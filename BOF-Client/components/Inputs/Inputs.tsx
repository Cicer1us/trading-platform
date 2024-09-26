import React, { FocusEventHandler, useRef, useState } from 'react';
import style from './Inputs.module.css';
import { CopyIcon, CopyIconSecondary } from '@/icons/InputIcons';
import { EyesClosed, EyesOpen } from '@/icons/EyesIcon';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { ToFixed } from '@/helpers/ToFixed';
import { RemoveCommas } from '@/helpers/FormattedNumber';
import useMultilingual from '@/hooks/useMultilingual';

type InputType = 'password' | 'text' | 'email' | 'number';

interface IInput {
  disabled?: boolean;
  onChange?: (e: unknown) => void;
  onValueChange?: (values: NumberFormatValues) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  type?: InputType;
  value?: string | number;
  state?: string;
  error?: string;
  placeholder?: string;
  showSecondaryIcon?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
  maxLength?: number;
}

export interface IInputCoin extends IInput {
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => void;
  coinName?: string;
  thousandSeparator?: boolean;
}

export const InputCoin: React.FC<IInputCoin> = ({
  onChange,
  onValueChange,
  onFocus,
  value,
  error,
  coinName,
  placeholder = '',
  disabled = false,
  thousandSeparator = true,
}): JSX.Element => {
  return (
    <div className={`${style.wrapperInputCoin} ${error ? style.error : ''}`}>
      <div className={style.wrapperInput}>
        <NumberFormat
          placeholder={placeholder}
          displayType={disabled ? 'text' : 'input'}
          className={style.input}
          value={value}
          onFocus={onFocus}
          thousandSeparator={thousandSeparator}
          isNumericString={true}
          allowNegative={false}
          onChange={onChange}
          onValueChange={onValueChange}
          isAllowed={values => {
            if (!values.value) return true;
            return (
              values.value === RemoveCommas(values.formattedValue).replace(/^0+(?=\d)/, '') &&
              values.value === ToFixed(values.value, coinName, 6)
            );
          }}
        />
        {error && <small className={style.errorText}>{error}</small>}
      </div>
    </div>
  );
};

export interface NumberInputProps extends IInput {
  value: number | null;
  onChange: (value: number) => void;
  decimalScale?: number;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  onChange,
  onFocus,
  value,
  error,
  placeholder = 0,
  disabled = false,
  decimalScale = 2,
  maxLength,
}): JSX.Element => {
  const [inputValue, setInputValues] = useState<NumberFormatValues>(null);

  const handleValue = values => {
    setInputValues(values);
    // to prevent invoking onChange for rounded value
    if (value === null || Number(Number(value).toFixed(decimalScale)) !== values.floatValue) {
      onChange(values.floatValue);
    }
  };

  // clear input if value is null
  const renderValue =
    value === null
      ? ''
      : // display previous formatted value with floating zeroes, thousand operator, etc.
      value !== inputValue?.floatValue
      ? value
      : inputValue?.formattedValue;

  return (
    <div className={`${style.wrapperInputCoin} ${error ? style.error : ''} ${disabled ? style.disabled : ''} `}>
      <div className={style.wrapperInput}>
        <NumberFormat
          disabled={disabled}
          decimalScale={decimalScale}
          className={style.input}
          value={renderValue}
          onFocus={onFocus}
          thousandSeparator={true}
          allowNegative={false}
          onValueChange={handleValue}
          placeholder={placeholder.toString()}
          maxLength={maxLength}
          isAllowed={values => {
            const { value, floatValue } = values;

            if (typeof floatValue === 'undefined' || typeof value === 'undefined') {
              return true;
            }

            // prevent leading zeroes
            if (value.charAt(0) === '0') {
              if (value.charAt(1) && value.charAt(1) != '.') {
                return false;
              }
            }
            return true;
          }}
        />
        {error && <small className={style.errorText}>{error}</small>}
      </div>
    </div>
  );
};

export const CopyInput: React.FC<IInput> = ({
  onChange = (): void => {
    return;
  },
  value,
  type = 'text',
  placeholder = 'address',
  showSecondaryIcon = false,
}): JSX.Element => {
  const { t } = useMultilingual('widget');

  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  let ref: HTMLInputElement;
  const onCopyClick = (): void => {
    ref.select();
    document.execCommand('copy');
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 1000);
  };
  return (
    <div className={style.grayInputContainer}>
      <input
        ref={(r: HTMLInputElement): HTMLInputElement => (ref = r)}
        type={type}
        onChange={onChange}
        value={value || ''}
        className={style.input}
        placeholder={placeholder}
        readOnly
      />
      <div onClick={onCopyClick} className={style.copy}>
        {showSecondaryIcon ? <CopyIconSecondary /> : <CopyIcon />}
      </div>
      <div className={`${style.copiedAlert} ${showCopiedAlert ? style.active : ''}`}>{t('copy')}</div>
    </div>
  );
};

type SizeValue = 'normal' | 'large' | 'small';

export interface IInputBase extends IInput {
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => void;
  disabled?: boolean;
  description?: string;
  size?: SizeValue;
  label?: string;
  name: string;
  id?: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => void;
  isSelectOnFocus?: boolean;
  step?: number;
  maxLength?: number;
}

export const InputBase: React.FC<IInputBase> = ({
  onChange,
  value,
  placeholder,
  disabled,
  size = 'normal',
  label,
  name,
  id,
  error,
  description,
  type = 'text',
  onBlur,
  isSelectOnFocus = false,
  step = 1,
  maxLength,
}): JSX.Element => {
  const InputRef: React.MutableRefObject<HTMLInputElement> = useRef();
  const [show, setShow] = useState(false);

  const onFocus = (): void => {
    if (isSelectOnFocus) {
      InputRef.current.select();
    }
  };

  const onIncrement = (): void => {
    InputRef.current.focus();
    onChange({ target: { value: String(+value + step) } });
  };

  const onDecrement = (): void => {
    InputRef.current.focus();
    onChange({ target: { value: String(+value - step) } });
  };

  const toggleShow = (): void => {
    InputRef.current.focus();
    setShow(!show);
  };

  return (
    <div className={style.wrapper}>
      {label && (
        <label className={style.label} htmlFor={id || name}>
          {label}
        </label>
      )}
      <div className={`${style.wrapperInput} ${size ? style[size] : ''} ${error ? style.inputError : ''}`}>
        <input
          ref={InputRef}
          id={id || name}
          name={name}
          type={show ? 'text' : type}
          onChange={e => onChange(e)}
          className={style.inputView}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          maxLength={maxLength}
        />
        {type === 'number' && (
          <div className={style.panel}>
            <button tabIndex={-1} onClick={onIncrement} type="button" />
            <button tabIndex={-1} onClick={onDecrement} type="button" />
          </div>
        )}
        {type === 'password' && (
          <div className={style.panelPassword}>
            <button tabIndex={-1} onClick={toggleShow} type="button">
              {show ? <EyesClosed /> : <EyesOpen />}
            </button>
          </div>
        )}
        {error && <small className={`${style.smallText} ${style.errorText}`}>{error}</small>}
        {description && !error && <small className={style.smallText}>{description}</small>}
      </div>
    </div>
  );
};

export const TextArea: React.FC<IInputBase> = ({
  onChange,
  value,
  placeholder,
  disabled,
  size = 'normal',
  label,
  name,
  id,
  error,
  description,
  onBlur,
}) => {
  return (
    <div className={style.wrapper}>
      {label && (
        <label className={style.label} htmlFor={id || name}>
          {label}
        </label>
      )}
      <div className={`${style.wrapperInput} ${size ? style[size] : ''} ${error ? style.inputError : ''}`}>
        <textarea
          style={{ resize: 'none' }}
          id={id || name}
          name={name}
          onChange={onChange}
          className={style.inputView}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onBlur={onBlur}
        />
        {error && <small className={`${style.smallText} ${style.errorText}`}>{error}</small>}
        {description && !error && <small className={style.smallText}>{description}</small>}
      </div>
    </div>
  );
};
