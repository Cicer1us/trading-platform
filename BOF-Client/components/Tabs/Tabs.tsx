import React from 'react';
import style from './Tabs.module.css';

export interface TabsProps {
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }: TabsProps): JSX.Element => (
  <div className={style.tabs}>{children}</div>
);

export default React.memo(Tabs);
