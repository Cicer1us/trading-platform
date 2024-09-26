import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BLOG, DOCS, TRADING_SWAP } from '@/common/LocationPath';
import style from './HeaderMobileNav.module.css';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import { SocialButtons } from '@/components/FloatingSocial/FloatingSocial';
import MenuAccordion from './MenuAccordion';

interface IHeaderMobileNav {
  handlerToggleBurgerMenu: () => void;
}

const HeaderMobileNav = ({}: IHeaderMobileNav): JSX.Element => {
  const router = useRouter();

  return (
    <div className={style.mobileMenu}>
      <nav className={style.navigationMobile}>
        <MenuAccordion />
        <Link href={BLOG} target="_blank" rel="noopener noreferrer" className={style.menuLink}>
          {'Blog'}
        </Link>
        <Link href={DOCS} target="_blank" rel="noopener noreferrer" className={style.menuLink}>
          {'Docs'}
        </Link>
      </nav>
      <div className={style.cta}>
        <ButtonSimple
          onClick={() => {
            router.push(TRADING_SWAP);
          }}
        >
          {'Start Trading'}
        </ButtonSimple>
        <div className={style.socialsWrapper}>
          <div className={style.socialButtonsWrapper}>
            <SocialButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMobileNav;
