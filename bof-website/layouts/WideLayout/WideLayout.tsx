import React from 'react';
import style from './WideLayout.module.css';
import FloatingHeader from '@/components/Navigation/FloatingHeader/FloatingHeader';

export interface WideLayoutProps {
  children: React.ReactNode;
}

const WideLayout: React.FC<WideLayoutProps> = ({ children }: WideLayoutProps) => {
  return (
    <>
      <div className={style.wrapper}>
        <FloatingHeader />
        <div className={style.content}>{children}</div>
      </div>
    </>
  );
};

export default WideLayout;
