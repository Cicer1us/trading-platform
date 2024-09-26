import { InputWithCoinIcon } from '@/components/Inputs/InputWithCoinIcon';
import { ToggleButton } from '@/ui-kit/ToggleButton/ToggleButton';
import { defaultUnit, Unit } from './common';
import style from '../LeverageTransactionModal.module.css';
import React from 'react';

const InputField = ({ inputField, value, inputOnChange, toggleOnChange, disabled }) => {
  return (
    <InputWithCoinIcon
      disabled={disabled}
      value={value}
      decimalScale={2}
      onChange={value => inputOnChange(inputField, value)}
      placeholder="0"
      prefixElement={
        <ToggleButton
          defaultValue={defaultUnit}
          onChange={value => toggleOnChange(inputField, value as Unit)}
          buttonOptions={[
            { title: '%', value: Unit.Percentage },
            { title: '$', value: Unit.Usd },
          ]}
        />
      }
      wrapperStyles={style.inputWrapper}
    />
  );
};

export default InputField;
