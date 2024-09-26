import React from 'react';
import style from './ButtonSwitch.module.css';
import ExchangeSwitchIcon from '@/icons/ExchangeSwitchIcon';

interface ButtonSwitchProps {
  onClick: () => void;
  disabled?: boolean;
}

const ButtonSwitch: React.FC<ButtonSwitchProps> = ({ onClick, disabled }: ButtonSwitchProps): JSX.Element => {
  return (
    <button type="button" className={`${style.button} ${disabled ? style.disabled : ''}`} onClick={onClick}>
      <ExchangeSwitchIcon height={16} width={16} />
    </button>
  );
};

export default React.memo(ButtonSwitch);
