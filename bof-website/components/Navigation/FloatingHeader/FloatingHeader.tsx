import React, { useState, useEffect } from 'react';
import { Events, Link as ScrollLink } from 'react-scroll';
import { useRouter } from 'next/router';
import Link from 'next/link';
import style from './FloatingHeader.module.css';
import { LogoBig } from '@/icons/Logo';
import { ButtonSimple } from 'components/Buttons/Buttons';
import { BLOG, DOCS, MAIN, TRADING_SWAP } from '@/common/LocationPath';
import { ProductsDropdown } from '../ProductsDropdown/ProductsDropdown';
import HeaderDropdownNav from '../HeaderDropdownNav/HeaderDropdownNav';

const Header = (): JSX.Element => {
  const [isScrollTop, setIsScrollTop] = useState(true);
  const router = useRouter();

  useEffect(() => {
    window.onscroll = (): void => {
      setIsScrollTop(window.pageYOffset !== 0);
    };

    return (): void => {
      Events.scrollEvent.remove('begin');
      window.onscroll = null;
    };
  }, []);

  useEffect(() => {
    window.onscroll = (): void => {
      setIsScrollTop(window.pageYOffset === 0);
    };
  }, []);

  return (
    <>
      <div className={style.seatReservation} id="top" />
      <div className={`${style.wrapper} boxStyle ${isScrollTop ? style.hideBorder : ''}`}>
        <header className={style.header}>
          <div className={style.desktop}>
            <Link href={MAIN} className={style.linkLogo}>
              <LogoBig />
            </Link>

            <div className={style.actions}>
              <ProductsDropdown />

              <Link href={BLOG} target="_blank" rel="noopener noreferrer" className={style.link}>
                {'Blog'}
              </Link>
              <Link href={DOCS} target="_blank" rel="noopener noreferrer" className={style.link}>
                {'Docs'}
              </Link>
              <Link href={TRADING_SWAP} target="_blank" rel="noopener noreferrer" className={style.linkButton}>
                <ButtonSimple
                  size="small"
                  color="green"
                  onClick={() => {
                    return;
                  }}
                >
                  Explore app
                </ButtonSimple>
              </Link>
            </div>
          </div>

          <div className={style.mobile}>
            {router.pathname === MAIN && (
              <ScrollLink className={style.linkLogo} to="top" spy smooth duration={1000}>
                <LogoBig />
              </ScrollLink>
            )}
            {router.pathname !== MAIN && (
              <Link href={MAIN} className={style.linkLogo}>
                <LogoBig />
              </Link>
            )}

            <div className={style.linksMobile}>
              <HeaderDropdownNav name={''} options={[]} />
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
