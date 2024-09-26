import React, { useRef } from 'react';
import style from './Footer.module.css';
import Link from 'next/link';
import { BLOG, TERMS } from '@/common/LocationPath';
import { LinkedinIcon } from '@/assets/icons/social_media/LinkedinIcon';
import { DiscordIcon } from '@/assets/icons/social_media/DiscordIcon';
import { TelegramIcon } from '@/assets/icons/social_media/TelegramIcon';
import { TwitterIcon } from '@/assets/icons/social_media/TwitterIcon';
import { YouTubeIcon } from '@/assets/icons/social_media/YouTubeIcon';

const socialLinks = [
  { url: 'https://t.me/bitoftradeOfficial', icon: <TelegramIcon /> },
  { url: 'https://www.linkedin.com/company/bitoftrade/', icon: <LinkedinIcon /> },
  { url: 'https://twitter.com/bitoftrade', icon: <TwitterIcon /> },
  { url: 'https://discord.gg/wfReEmmzrd', icon: <DiscordIcon /> },
  { url: 'https://www.youtube.com/@bitoftrade', icon: <YouTubeIcon /> },
];

const Footer = (): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.linksContainer}>
          <Link href={BLOG}>
            <a target="_blank" rel="noopener noreferrer" className={style.linksTitle}>
              {'Blog'}
            </a>
          </Link>
          <Link href={TERMS}>
            <a target="_blank" rel="noopener noreferrer" className={style.linksTitle}>
              {'Terms of Service'}
            </a>
          </Link>
          <a
            href="https://bitoftrade.zendesk.com/hc/en-us"
            target="_blank"
            rel="noopener noreferrer"
            className={style.linksTitle}
          >
            {'Help Center'}
          </a>
        </div>

        <div className={style.smContainer} ref={ref}>
          {socialLinks.map((item, index) => (
            <div className={style.icon} key={`${item.url}-${index}`}>
              <a target="_blank" rel="noopener noreferrer" href={item.url}>
                {item.icon}
              </a>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
