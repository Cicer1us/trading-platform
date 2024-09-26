import React, { useEffect, useState } from 'react';
import style from './Header.module.css';
import LogoLink from '@/components/LogoLink/LogoLink';
import { LogoBig, LogoMobile } from '@/icons/Logo';
import LoginButton from '@/components/LoginButton/LoginButton';
import ChainSwitcher from '@/components/ChainSwitcher/ChainSwitcher';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import TradingBurgerMenuSettings from 'pagesContent/Trading/BurgerMenuSettings/TradingBurgerMenuSettings';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import Select from '@/components/Select/Select';
import useMultilingual from '@/hooks/useMultilingual';
import Link from 'next/link';
import { TradingRoute } from '@/common/trading-routes';
import { useRouter } from 'next/router';
import { InfoDropdown } from '../InfoDropdown/InfoDropdown';

const Header: React.FC = (): JSX.Element => {
  const { t } = useMultilingual('header');

  const router = useRouter();
  const [openBurgerMenu, setOpenBurgerMenu] = useState<boolean>(false);

  const tab = useAppSelector(({ widget }) => widget.tab);

  const handlerToggleBurgerMenu = (): void => {
    setOpenBurgerMenu(!openBurgerMenu);
  };

  const routeStyles = href => {
    return router.asPath.indexOf(href) === 0 ? `${style.tab} ${style.active}` : style.tab;
  };

  const getValueTitle = () => {
    if (router.asPath.indexOf(TradingRoute.Swap) === 0) return t('swap');
    if (router.asPath.indexOf(TradingRoute.Leverage) === 0) return t('leverage');
    if (router.asPath.indexOf(TradingRoute.Fiat) === 0) return t('fiat');
    if (router.asPath.indexOf(TradingRoute.CrossChain) === 0) return t('cross-chain');
    if (router.asPath.indexOf(TradingRoute.MARKETS) === 0) return t('markets');
    return tab;
  };

  useEffect(() => {
    if (tab && openBurgerMenu) {
      setOpenBurgerMenu(false);
    }
  }, [tab]);

  return (
    <>
      <div className={style.seatReservation} />
      <div className={`${style.wrapper} ${style.shadow} boxStyle`}>
        <header className={style.header}>
          <div className={style.desktop}>
            <div className={style.desktopGrid}>
              <LogoLink>
                <LogoBig />
              </LogoLink>
              <div className={style.tabs}>
                <Link href={TradingRoute.Swap}>
                  <a className={routeStyles(TradingRoute.Swap)}>{t('swap')}</a>
                </Link>
                <Link href={TradingRoute.Leverage}>
                  <a className={routeStyles(TradingRoute.Leverage)}>{t('leverage')}</a>
                </Link>
                <Link href={TradingRoute.Fiat}>
                  <a className={routeStyles(TradingRoute.Fiat)}>{t('fiat')}</a>
                </Link>
                <Link href={TradingRoute.CrossChain}>
                  <a className={routeStyles(TradingRoute.CrossChain)}>{t('cross-chain')}</a>
                </Link>
                <Link href={TradingRoute.MARKETS}>
                  <a className={routeStyles(TradingRoute.MARKETS)}>{t('markets')}</a>
                </Link>
              </div>
            </div>
            <div className={style.actions}>
              <InfoDropdown />
              <ChainSwitcher />
              <LoginButton />
            </div>
          </div>

          <div className={style.mobile}>
            <LogoLink>
              <LogoMobile />
            </LogoLink>
            <div className={style.rightSideMobile}>
              <ChainSwitcher />
              <Select
                zIndex={1001}
                size="inherit"
                options={[
                  { value: TradingRoute.Swap, title: t('swap') },
                  { value: TradingRoute.Leverage, title: t('leverage') },
                  { value: TradingRoute.Fiat, title: t('fiat') },
                  { value: TradingRoute.CrossChain, title: t('cross-chain') },
                  { value: TradingRoute.MARKETS, title: t('markets') },
                ]}
                isListOfReferences={true}
                handlerSelected={null}
                selectedValue={tab}
                wrapperStyles={style.tabSelectWrapper}
                wrapperInputStyles={style.wrapperInput}
                getValueTitle={getValueTitle}
              />
              <BurgerMenu type={'trading'} toggleMenu={handlerToggleBurgerMenu} isOpen={openBurgerMenu}>
                <TradingBurgerMenuSettings />
              </BurgerMenu>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default React.memo(Header);
