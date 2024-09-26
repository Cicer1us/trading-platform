import React, { useState } from 'react';
import style from './ToggleButton.module.css';

interface ButtonOption {
  title: string;
  value: string;
}
interface Props {
  onChange: (selectedValue: string) => void;
  defaultValue: string;
  buttonOptions: ButtonOption[];
}

export const ToggleButton: React.FC<Props> = ({ buttonOptions, onChange, defaultValue }) => {
  const [selected, setSelected] = useState<string>(defaultValue);

  const handleValueChange = (selectedValue: string) => {
    setSelected(selectedValue);
    onChange(selectedValue);
  };

  return (
    <div className={style.toggleWrapper}>
      {buttonOptions.map(({ title, value }) => (
        <div
          key={value}
          className={`${style.toggleOption} ${selected === value ? style.active : ''}`}
          onClick={() => handleValueChange(value)}
        >
          {title}
        </div>
      ))}
    </div>
  );
};
