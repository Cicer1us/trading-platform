import React, { useState, useEffect } from 'react';
import style from './Select.module.css';
import ArrowDropdownIcon from '@/icons/ArrowDropdownIcon';
import CoinsLabel from '@/components/CoinsLabel/CoinsLabel';
import Link from 'next/link';
import { Link as LinkScroll } from 'react-scroll';

export interface Option {
  value: string;
  title: string;
  symbol?: string;
}

export interface SelectProps {
  size?: string;
  isListOfReferences?: boolean;
  isListOfAnchors?: boolean;
  options: Array<Option>;
  handlerSelected: (a: string) => void;
  disabled?: boolean;
  menuPosition?: string;
  selectedValue: string;
  reset?: boolean;
  wrapperInputStyles?: string;
  wrapperStyles?: string;
  menuStyles?: string;
  staticTitle?: string;
  getValueTitle?: () => string;
  zIndex?: number;
}

const Select: React.FC<SelectProps> = ({
  size = 'medium',
  options = [],
  handlerSelected,
  isListOfReferences = false,
  isListOfAnchors = false,
  disabled = false,
  menuPosition = 'bottom',
  selectedValue = null,
  reset = false,
  wrapperInputStyles,
  wrapperStyles,
  menuStyles,
  staticTitle,
  getValueTitle,
  zIndex = 20,
}: SelectProps): JSX.Element => {
  const [selectedOption, setSelectedOption] = useState<Option>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  let ref: HTMLDivElement;

  const onSelect = (option: Option): void => {
    if (isListOfAnchors) {
      setOpenMenu(false);
    } else if (!isListOfReferences) {
      handlerSelected(option.value);
      setSelectedOption(option);
    }
  };

  const onToggle = (e: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    if (openMenu) {
      ref.focus();
    }
  }, [openMenu]);

  useEffect(() => {
    setSelectedOption(options.find(opt => opt.value === selectedValue));
  }, [options, reset]);

  const getSelectedValueTitle = () => {
    if (staticTitle) {
      return staticTitle;
    }
    if (!isListOfReferences) {
      return selectedOption?.title;
    }

    if (getValueTitle) {
      return getValueTitle();
    }

    return selectedValue;
  };

  return (
    <div
      style={{ zIndex }}
      className={`${style.wrapper} ${openMenu ? style.active : ''} ${disabled ? style.disabled : ''} ${wrapperStyles} `}
      onClick={disabled ? null : onToggle}
      ref={(el): HTMLDivElement => (ref = el)}
      tabIndex={0}
      onBlur={(e): void => {
        if (openMenu) onToggle(e);
      }}
    >
      <div className={`${style.wrapperInput} ${size ? style[size] : ''} ${wrapperInputStyles}`}>
        {selectedOption?.symbol && <CoinsLabel coinsNames={selectedOption.symbol} size={32} />}
        <span className={style.inputView}>{getSelectedValueTitle()}</span>
        <ArrowDropdownIcon />
      </div>
      {!!options.length && (
        <ul className={`${menuStyles} ${style.menu} ${style[menuPosition]} scroll`}>
          {options.map((option, i) => (
            <li
              key={`${option.title}-${i}`}
              className={`${style.option} ${!isListOfReferences && !isListOfAnchors ? style.optionPadding : ''} `}
              onClick={(): void => onSelect(option)}
            >
              {isListOfReferences && (
                <Link href={option.value}>
                  <a className={`${style.title} ${style.optionPadding}`}>{option.title}</a>
                </Link>
              )}
              {isListOfAnchors && (
                <LinkScroll
                  onClick={(): void => onSelect(option)}
                  to={option.value}
                  spy
                  smooth
                  duration={1000}
                  className={`${style.title} ${style.optionPadding}`}
                >
                  <a>{option.title}</a>
                </LinkScroll>
              )}
              {!isListOfReferences && !isListOfAnchors && (
                <>
                  {option?.symbol && <CoinsLabel coinsNames={option.symbol} size={32} />}
                  <span className={style.title}>{option.title}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
