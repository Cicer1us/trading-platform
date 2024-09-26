import React from 'react';
import style from './TradingFooter.module.css';
import Link from 'next/link';
import useMultilingual from '@/hooks/useMultilingual';
import { LinkedinIcon } from '@/assets/icons/social_media/LinkedinIcon';
import { DiscordIcon } from '@/assets/icons/social_media/DiscordIcon';
import { TERMS } from '@/common/LocationPath';
import { TelegramIcon } from '@/assets/icons/social_media/TelegramIcon';
import { TwitterIcon } from '@/assets/icons/social_media/TwitterIcon';

const socialLinks = [
  { url: 'https://t.me/bitoftradeOfficial', icon: <TelegramIcon size={'24'} color={'var(--arrowColor)'} /> },
  { url: 'https://discord.gg/wfReEmmzrd', icon: <DiscordIcon size={'24'} color={'var(--arrowColor)'} /> },
  {
    url: 'https://www.linkedin.com/company/bitoftrade/',
    icon: <LinkedinIcon size={'24'} color={'var(--arrowColor)'} />,
  },
  { url: 'https://twitter.com/bitoftrade', icon: <TwitterIcon size={'24'} color={'var(--arrowColor)'} /> },
];
const TradingFooter = (): JSX.Element => {
  const { t } = useMultilingual('footer');

  return (
    <footer className={style.footer}>
      <div className={style.footerContainer}>
        <div className={style.footerUp}>
          <div className={style.links}>
            <Link href={TERMS}>
              <a>{t('termsOfUse')}</a>
            </Link>
            <a target="_blank" href="https://bitoftrade.canny.io/request-features" className={style.newFeatureTitle}>
              {t('requestFeature')}
            </a>
            <a
              href="https://bitoftrade.zendesk.com/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className={style.footerItem}
            >
              {t('helpCenter')}
            </a>
          </div>
          {/*<ButtonSimple onClick={() => ZendeskAPI('webWidget', 'toggle')}>Myybutton</ButtonSimple>*/}

          <div className={style.socialLinks}>
            {socialLinks.map((item, index) => (
              <div className={style.icon} key={`${item.url}-${index}`}>
                <a target="_blank" href={item.url}>
                  {item.icon}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(TradingFooter);
