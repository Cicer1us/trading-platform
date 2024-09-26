import ArrowDropdownIcon from '@/assets/icons/ArrowDropdownIcon';
import style from './TradingBurgerMenuSettings.module.css';
import React, { useState } from 'react';

interface BurgerMenuListProps {
  options: BurgerListOption[];
  title: string;
}

export interface BurgerListOption {
  icon?: React.ReactNode;
  title: string;
  onClick: () => void;
}

interface BurgerMenuListItemProps {
  onClick?: () => void;
  title: string;
  link?: string;
}

export function BurgerMenuItem({ onClick, title, link }: BurgerMenuListItemProps) {
  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className={style.optionWrapper}>
      {title}
    </a>
  ) : (
    <div onClick={onClick} className={`${style.optionWrapper}`}>
      <div className={style.option}>{title}</div>
    </div>
  );
}

export function BurgerMenuList({ options, title }: BurgerMenuListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => setIsOpen(open => !open);

  return (
    <div>
      <div onClick={toggle} className={`${style.optionWrapper} ${isOpen ? style.active : ''}`}>
        <div className={style.option}>{title}</div>
        <ArrowDropdownIcon />
      </div>
      <div className={`${style.optionDropdown} ${isOpen ? style.active : ''}`}>
        {isOpen &&
          options.map(item => {
            return (
              <div key={`${item.title}`} onClick={item.onClick}>
                {item.icon}
                {item.title}
              </div>
            );
          })}
      </div>
    </div>
  );
}
