import React from 'react';
import style from '@/styles/mainBackground.module.css';
import Header from '@/components/TradingHeader/Header';
import TradingFooter from '@/components/Footer/TradingFooter';
export interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }: AppLayoutProps) => {
  return (
    <>
      <div className={`${style.wrapper} AppLayout ui-kit`}>
        <div className={style.backgroundEffects}>
          <div className={style.circlesWrapper}>
            <div className={style.greenCircle}>
              <div className={style.redCircle1} />
              <div className={style.redCircle2} />
            </div>
          </div>
        </div>
        <Header />
        <div className={style.content}>{children}</div>
        <TradingFooter />
      </div>
    </>
  );
};

export default React.memo(AppLayout);
