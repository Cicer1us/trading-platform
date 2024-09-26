import Dropdown, { DropMenuItemConfig, DropMenuItemType } from '@/components/Dropdown/Dropdown';
import React, { useState } from 'react';
import style from './ProductsDropdown.module.css';
import { TRADING_SWAP, TRADING_LEVERAGE, FIAT, MARKETS } from '@/common/LocationPath';

export const infoDropdownConfig: DropMenuItemConfig[] = [
  { data: { title: 'For developers' }, type: DropMenuItemType.CATEGORY },
  { data: { title: 'Cross-Chain Messaging', link: '/cross-chain' }, type: DropMenuItemType.PAGE },
  { data: { title: 'For businesses' }, type: DropMenuItemType.CATEGORY },
  { data: { title: 'AllPay Widget', link: '/allpay-widget' }, type: DropMenuItemType.PAGE },
  { data: { title: 'Crypto Payment', link: '/crypto-payment' }, type: DropMenuItemType.PAGE },
  { data: { title: 'For traders' }, type: DropMenuItemType.CATEGORY },
  {
    data: { title: 'Trading platform' },
    type: DropMenuItemType.SUBMENU,
    submenu: [
      {
        data: { title: 'Swap', link: TRADING_SWAP },
        type: DropMenuItemType.LINK,
      },
      {
        data: { title: 'Leverage', link: TRADING_LEVERAGE },
        type: DropMenuItemType.LINK,
      },
      {
        data: { title: 'Fiat', link: FIAT },
        type: DropMenuItemType.LINK,
      },
      {
        data: { title: 'Markets', link: MARKETS },
        type: DropMenuItemType.LINK,
      },
    ],
  },
];

export const ProductsDropdown = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => setIsOpen(open => !open);

  return (
    <>
      <Dropdown
        border={false}
        isOpen={isOpen}
        toggle={toggle}
        title={'Products'}
        config={infoDropdownConfig}
        className={`${style.products} ${style.dropdown} ${style.title}`}
      />
    </>
  );
};
