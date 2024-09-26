import React, { useEffect } from 'react';
import style from './BurgerMenu.module.css';

export interface BurgerMenuProps {
  children: React.ReactNode;
  toggleMenu: () => void;
  isOpen: boolean;
  fixedThemeColor?: string;
  type: 'trading' | 'landing';
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({
  children,
  toggleMenu,
  isOpen,
  fixedThemeColor,
  type,
}: BurgerMenuProps): JSX.Element => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // polyfill for mobile browsers
      document.getElementById('__next').style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.getElementById('__next').style.overflow = '';
    }
  }, [isOpen]);

  return (
    <div
      className={`${style.burgerMenu} ${type === 'landing' ? style.transparent : ''} ${
        fixedThemeColor ? style[fixedThemeColor] : ''
      }`}
    >
      <button type="button" className={`${style.menuButton} ${isOpen ? style.openMenu : ''}`} onClick={toggleMenu}>
        <div className={style.menuButtonLines}>
          <span className={style.menuButtonLine} />
          <span className={style.menuButtonLine} />
          <span className={style.menuButtonLine} />
        </div>
      </button>
      {<div className={`${style.menu} ${isOpen ? style.menuOpen : ''}`}>{children}</div>}
    </div>
  );
};

export default React.memo(BurgerMenu);
