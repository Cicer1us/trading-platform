import React from 'react';
import style from './Tab.module.css';

export interface TabProps {
  className?: string;
  children: string;
  handlerSelect: (a: string) => void;
  isActive: boolean;
}

const Tab: React.FC<TabProps> = ({ children, handlerSelect, isActive, className }: TabProps): JSX.Element => (
  <div
    className={`${style.tab} ${isActive ? style.active : ''} ${className}`}
    onClick={(): void => handlerSelect(children)}
  >
    {children}
  </div>
);

export default React.memo(Tab);
