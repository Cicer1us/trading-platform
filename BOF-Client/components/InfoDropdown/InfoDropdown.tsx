import React, { useState } from 'react';
import Dropdown, { DropMenuItemConfig, DropMenuItemType } from '../Dropdown/Dropdown';
import { VideoPlayer } from '../VideoPlayer/VideoPlayer';

export const infoDropdownConfig: DropMenuItemConfig[] = [
  { data: { title: 'Blog', link: '/blog' }, type: DropMenuItemType.LINK },
  {
    data: { title: 'Video Tutorial' },
    type: DropMenuItemType.SUBMENU,
    submenu: [
      {
        data: { title: 'How to Connect Your Trust Wallet on bitoftrade', videoId: 'aj0CKrKlric' },
        type: DropMenuItemType.VIDEO,
      },
      {
        data: { title: 'How to Connect Your MetaMask Wallet with your mobile', videoId: 'FIXjp8uLZLc' },
        type: DropMenuItemType.VIDEO,
      },
      {
        data: { title: 'How to Connect Your Metamask Wallet on bitoftrade', videoId: 'xAWdJTzvhV4' },
        type: DropMenuItemType.VIDEO,
      },
      {
        data: { title: 'How to read a Candle Stick Chart', videoId: '-gL0fml5kW0' },
        type: DropMenuItemType.VIDEO,
      },
      {
        data: { title: 'How to place Stop-Loss order on bitoftrade', videoId: 'Yjwt7hALGPI' },
        type: DropMenuItemType.VIDEO,
      },
      {
        data: { title: 'How to buy crypto with fiat on bitoftrade', videoId: 'yK_WXrt7ZrM' },
        type: DropMenuItemType.VIDEO,
      },
      {
        data: { title: 'How to Place A Limit Order on bitoftrade', videoId: '_aj8h0H7OVw' },
        type: DropMenuItemType.VIDEO,
      },
      {
        data: { title: 'How to Swap on Polygon network via bitoftrade', videoId: 'Vwdua-eAhVo' },
        type: DropMenuItemType.VIDEO,
      },
      {
        data: { title: 'How to Add Polygon tokens to MetaMask', videoId: 'd-ETPo7MOLA' },
        type: DropMenuItemType.VIDEO,
      },
      {
        data: { title: 'How to Add Polygon network to MetaMask', videoId: '5suiZvOYaCI' },
        type: DropMenuItemType.VIDEO,
      },
    ],
  },
];

const getVideoTitleById = (videoId: string, menuItems: DropMenuItemConfig[]): string | null => {
  for (const menuItem of menuItems) {
    if (menuItem.type === DropMenuItemType.VIDEO && menuItem.data.videoId === videoId) {
      return menuItem.data.title;
    }
    if (menuItem.type === DropMenuItemType.SUBMENU && !!menuItem.submenu.length) {
      const title = getVideoTitleById(videoId, menuItem.submenu);
      if (title) return title;
    }
  }
  return null;
};

export const InfoDropdown = () => {
  const [videoId, setVideoId] = useState<string>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => setIsOpen(open => !open);
  const onVideoClose = () => setVideoId(null);
  const videoTitle = videoId && getVideoTitleById(videoId, infoDropdownConfig);

  return (
    <>
      <Dropdown isOpen={isOpen} toggle={toggle} title={'Info'} config={infoDropdownConfig} onVideoClick={setVideoId} />
      <VideoPlayer videoId={videoId} onClose={onVideoClose} title={videoTitle} />
    </>
  );
};
