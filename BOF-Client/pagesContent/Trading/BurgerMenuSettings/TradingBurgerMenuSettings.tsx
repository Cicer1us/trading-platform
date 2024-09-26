import React, { useState } from 'react';
import style from './TradingBurgerMenuSettings.module.css';
import LoginButton from '@/components/LoginButton/LoginButton';
import { infoDropdownConfig } from '@/components/InfoDropdown/InfoDropdown';
import { BurgerMenuItem, BurgerMenuList } from './MenuList';
import { DropMenuItemConfig, DropMenuItemType } from '@/components/Dropdown/Dropdown';
import { VideoPlayer } from '@/components/VideoPlayer/VideoPlayer';
import { SocialButtons } from '@/components/FloatingSocial/FloatingSocial';

const parseInfoConfig = (menu: DropMenuItemConfig[]): [DropMenuItemConfig[], DropMenuItemConfig[]] => {
  const videos = [];
  const links = [];

  const parseSubmenu = (menuItems: DropMenuItemConfig[]) => {
    for (const menuItem of menuItems) {
      if (menuItem.type === DropMenuItemType.VIDEO) {
        videos.push(menuItem);
      }
      if (menuItem.type === DropMenuItemType.LINK) {
        links.push(menuItem);
      }
      if (menuItem.type === DropMenuItemType.SUBMENU && !!menuItem.submenu.length) {
        parseSubmenu(menuItem.submenu);
      }
    }
  };

  parseSubmenu(menu);

  return [videos, links];
};

const TradingBurgerMenuSettings: React.FC = (): JSX.Element => {
  const [videoId, setVideoId] = useState<string>(null);
  const onVideoClose = () => setVideoId(null);

  const [videos, links] = parseInfoConfig(infoDropdownConfig);
  const videosOptions = videos.map(video => ({
    title: video.data.title,
    onClick: () => setVideoId(video.data.videoId),
  }));
  const linksOptions = links.map(link => ({
    title: link.data.title,
    href: link.data.link,
  }));

  const videoTitle = videoId && videos.find(vid => vid.data.videoId === videoId).data.title;
  return (
    <div className={style.container}>
      <VideoPlayer title={videoTitle} videoId={videoId} onClose={onVideoClose} />
      {linksOptions.map(link => (
        <BurgerMenuItem title={link.title} link={link.href} key={link.href} />
      ))}
      <BurgerMenuList title={'Video Tutorial'} options={videosOptions} />
      <div className={style.login}>
        <LoginButton />
      </div>
      <div className={style.socialsWrapper}>
        <div className={style.socialButtonsWrapper}>
          <SocialButtons />
        </div>
      </div>
    </div>
  );
};

export default React.memo(TradingBurgerMenuSettings);
