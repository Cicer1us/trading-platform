import React from 'react';
import styles from './FloatingSocial.module.css';
import { LinkedinIcon } from '@/assets/icons/social_media/LinkedinIcon';
import { DiscordIcon } from '@/assets/icons/social_media/DiscordIcon';
import { TelegramIcon } from '@/assets/icons/social_media/TelegramIcon';
import { TwitterIcon } from '@/assets/icons/social_media/TwitterIcon';

const FloatingSocialButtons = ({ isVisible }): JSX.Element => {
  return (
    <div className={`${styles.wrapper} ${isVisible && styles.hide}`}>
      <SocialButtons />
    </div>
  );
};

export const SocialButtons = (): JSX.Element => {
  const socialLinks = [
    { url: 'https://t.me/bitoftradeOfficial', icon: <TelegramIcon /> },
    { url: 'https://www.linkedin.com/company/bitoftrade/', icon: <LinkedinIcon /> },
    { url: 'https://twitter.com/bitoftrade', icon: <TwitterIcon /> },
    { url: 'https://discord.gg/wfReEmmzrd', icon: <DiscordIcon /> },
  ];

  return (
    <>
      {socialLinks.map((item, index) => (
        <div className={styles.icon} key={`${item.url}-${index}`}>
          <a target="_blank" href={item.url}>
            {item.icon}
          </a>
        </div>
      ))}
    </>
  );
};

export default FloatingSocialButtons;
