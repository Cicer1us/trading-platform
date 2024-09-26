import React from 'react';
import style from './SocialMediaList.module.css';

const SocialMediaList = (): JSX.Element => {
  return (
    <>
      <div className={style.SMwrapper}>
        <h2 className={style.socialMediaTitle}>Follow us in social media</h2>
        <h3 className={style.socialMediaSubtitle}>
          Get more involved with our members, meet like-minded individuals, <br /> and be one of the first to know about
          our latest updates.
        </h3>
        <div className={style.SMlist}>
          <a href="https://t.me/bitoftradeOfficial" target="_blank" rel="noopener noreferrer">
            <img className={style.icon} src="/images/Landing/sm/telegram.png" alt="Telegram" loading="lazy" />
          </a>
          <a href="https://discord.gg/wfReEmmzrd" target="_blank" rel="noopener noreferrer">
            <img className={style.icon} src="/images/Landing/sm/discord.png" alt="Discord" loading="lazy" />
          </a>
          <a href="https://www.linkedin.com/company/bitoftrade/" target="_blank" rel="noopener noreferrer">
            <img className={style.icon} src="/images/Landing/sm/linkedin.png" alt="LinkedIn" loading="lazy" />
          </a>
          <a href="https://twitter.com/bitoftrade" target="_blank" rel="noopener noreferrer">
            <img className={style.icon} src="/images/Landing/sm/twitter.png" alt="Twitter" loading="lazy" />
          </a>
          <a href="https://www.youtube.com/@bitoftrade" target="_blank" rel="noopener noreferrer">
            <img className={style.icon} src="/images/Landing/sm/youtube.png" alt="YouTube" loading="lazy" />
          </a>
        </div>
      </div>
    </>
  );
};

export default SocialMediaList;
