import React from 'react';
import style from './Tabs.module.css';

export interface TabsProps {
  children: React.ReactNode;
}

const TransactionTableTabs: React.FC<TabsProps> = ({ children }: TabsProps): JSX.Element => (
  <div className={style.transactionsTabs}>{children}</div>
);

export default React.memo(TransactionTableTabs);
