import React, { ReactNode, useRef, useState } from 'react';
import style from './InputSearch.module.css';
import SearchIcon from '@/icons/SearchIcon';
import CloseIcon from '@/assets/icons/CloseIcon';
import { useEffect } from 'react';
import { useFocus } from '@/hooks/useFocus';

interface InputSearchProps {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputSearch: React.FC<InputSearchProps> = ({
  value,
  placeholder = 'Search...',
  onChange,
}): JSX.Element => {
  return (
    <div className={style.search}>
      <div className={style.wrapper}>
        <SearchIcon size={16} />
        <input className={style.inputSearch} type="text" value={value} placeholder={placeholder} onChange={onChange} />
        {!!value && (
          <div onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}>
            <CloseIcon />
          </div>
        )}
      </div>
    </div>
  );
};

interface InputDropdownSearchProps extends InputSearchProps {
  children: ReactNode;
}

export const InputDropdownSearch: React.FC<InputDropdownSearchProps> = ({
  value,
  placeholder = 'Search...',
  onChange,
  children,
}): JSX.Element => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [inputRef, setInputFocus, setInputBlur] = useFocus();

  const onToggle = () => {
    setOpenDropdown(state => !state);
  };

  useEffect(() => {
    if (openDropdown) setInputFocus();
  }, [openDropdown]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setInputFocus();
  };

  const onClear = () => {
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div
      className={`${style.search} ${openDropdown ? style.active : ''}`}
      tabIndex={1}
      onClick={() => {
        if (!openDropdown) onToggle();
      }}
    >
      <div className={`${style.wrapper}`}>
        <div className={style.mobileSearchIcon}>
          {!openDropdown ? (
            <SearchIcon size={16} />
          ) : (
            <div onClick={() => onToggle()} className={style.closeDropdownIcon}>
              <CloseIcon size={16} stroke={'var(--green)'} />
            </div>
          )}
        </div>
        <div className={style.desktopSearchIcon}>
          <SearchIcon size={16} />
        </div>
        <div className={style.inputWrapper}>
          <input
            ref={inputRef}
            className={style.inputSearch}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={onInputChange}
            onBlur={() => {
              // remove focus from input when e.g. user change switch browser tab
              setInputBlur();
              if (openDropdown) onToggle();
            }}
          />
          {!!value && (
            <div onClick={onClear} className={style.closeIcon}>
              <CloseIcon />
            </div>
          )}
        </div>
      </div>
      <div className={style.dropdown}>{children}</div>
    </div>
  );
};

interface InputDebounceSearchProps {
  debounceInterval: number;
  setLoading?: (load: boolean) => void;
  onChange: (e: string) => void;
  placeholder: string;
}

export const InputDebounceSearch: React.FC<InputDebounceSearchProps> = ({
  placeholder = 'Search...',
  onChange,
  setLoading,
  debounceInterval,
}): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>('');
  const timer = useRef(null);

  const updateInput = (currentValue = null) => {
    clearTimeout(timer.current);
    if (currentValue !== inputValue) {
      if (currentValue) {
        setLoading(true);
        setInputValue(currentValue);

        timer.current = setTimeout(() => {
          onChange(currentValue);
        }, debounceInterval);
      } else {
        setInputValue('');
        onChange(currentValue);
      }
    }
  };

  return (
    <div className={style.search}>
      <div className={style.wrapper}>
        <SearchIcon size={16} />
        <input
          className={style.inputSearch}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={({ target: { value } }) => updateInput(value)}
        />
        {!!inputValue && (
          <div onClick={() => updateInput(null)}>
            <CloseIcon />
          </div>
        )}
      </div>
    </div>
  );
};
