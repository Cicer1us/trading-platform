import React, { useState, useEffect } from 'react';
import style from './HeaderDropdownNav.module.css';
import Link from 'next/link';
import { BLOG, DOCS, TRADING_SWAP } from '@/common/LocationPath';
import MenuAccordion from '../HeaderMobileNav/MenuAccordion';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import { TelegramIcon } from '@/assets/icons/social_media/TelegramIcon';
import { LinkedinIcon } from '@/assets/icons/social_media/LinkedinIcon';
import { DiscordIcon } from '@/assets/icons/social_media/DiscordIcon';
import { TwitterIcon } from '@/assets/icons/social_media/TwitterIcon';

interface HeaderDropdownNavProps {
  key?: string | number;
  name: string;
  options: Array<{
    label: string;
    value: string;
  }>;
}

const HeaderDropdownNav: React.FC<HeaderDropdownNavProps> = (): JSX.Element => {
  let ref: HTMLDivElement;
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  useEffect(() => {
    if (isOpenMenu) {
      ref.focus();
    }
  }, [isOpenMenu]);

  return (
    <div ref={(el): HTMLDivElement => (ref = el)} tabIndex={0} className={style.wrapper} onBlur={(): void => {}}>
      <div className={style.burgerMenu} onClick={() => setIsOpenMenu(!isOpenMenu)}>
        <img className={style.img} src="/images/Landing/Menu.png" />
      </div>

      <div className={`${style.menuDropdown} ${isOpenMenu ? style.openMenu : ''}`}>
        <MenuAccordion />
        <Link
          href={BLOG}
          target="_blank"
          rel="noopener noreferrer"
          className={`${style.menuLink} ${style.menuDropdownItem}`}
        >
          Blog
        </Link>
        <Link
          href={DOCS}
          target="_blank"
          rel="noopener noreferrer"
          className={`${style.menuLink} ${style.menuDropdownItem}`}
        >
          Docs
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

        <div className={style.smwrap}>
          <a target="_blank" rel="noopener noreferrer" href="https://t.me/bitoftradeOfficial">
            <TelegramIcon />
          </a>
          <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/wfReEmmzrd">
            <DiscordIcon />
          </a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/bitoftrade/">
            <LinkedinIcon />
          </a>
          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/bitoftrade">
            <TwitterIcon />
          </a>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeaderDropdownNav);
