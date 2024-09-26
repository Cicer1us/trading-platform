import { CROSS_CHAIN_MSG_DOCS, ALLPAY } from '@/common/LocationPath';
import Dropdown, { DropMenuItemConfig, DropMenuItemType } from '@/components/Dropdown/Dropdown';
import React, { useState } from 'react';
import style from './ProductsDropdown.module.css';

export const infoDropdownConfig: DropMenuItemConfig[] = [
  { data: { title: 'For developers' }, type: DropMenuItemType.CATEGORY },
  { data: { title: 'Cross Chain Messaging', link: CROSS_CHAIN_MSG_DOCS }, type: DropMenuItemType.LINK },
  { data: { title: 'For businesses' }, type: DropMenuItemType.CATEGORY },
  { data: { title: 'AllPay Widget', link: ALLPAY }, type: DropMenuItemType.LINK },
  { data: { title: 'For traders' }, type: DropMenuItemType.CATEGORY },
  {
    data: { title: 'Trading platform' },
    type: DropMenuItemType.SUBMENU,
    submenu: [
      {
        data: { title: 'Swap', link: 'https://bitoftrade.com/trading/swap' },
        type: DropMenuItemType.LINK,
      },
      {
        data: { title: 'Leverage', link: 'https://bitoftrade.com/trading/leverage' },
        type: DropMenuItemType.LINK,
      },
      {
        data: { title: 'Fiat', link: 'https://bitoftrade.com/fiat-exchange' },
        type: DropMenuItemType.LINK,
      },
      {
        data: { title: 'Markets', link: 'https://bitoftrade.com/markets' },
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
