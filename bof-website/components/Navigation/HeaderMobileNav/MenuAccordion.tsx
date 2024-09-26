import React from 'react';
import style from './MenuAccordion.module.css';
import ArrowDropdownIcon from '@/assets/icons/ArrowDropdownIcon';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { TRADING } from '@/common/LocationPath';
import Link from 'next/link';

export default function MenuAccordion() {
  return (
    <Accordion allowZeroExpanded className={style.container}>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton className={style.title}>
            Products <ArrowDropdownIcon className={style.arrowIcon} stroke="#FFFFFF" />
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <div className={style.linksWrap}>
            <div className={style.category}>For developers</div>
            <Link href={'/cross-chain'} className={style.link}>
              Cross chain messaging
            </Link>
            <div className={style.divider} />
            <div className={style.category}>For business</div>
            <Link href={'/allpay-widget'} className={style.link}>
              AllPay Widget
            </Link>
            <br />
            <Link href={'/crypto-payment'} className={style.link}>
              Crypto Payment
            </Link>
            <div className={style.divider} />
            <div className={style.category}>For traders</div>
            <a target="_blank" rel="noopener noreferrer" href={TRADING} className={style.link}>
              Trading platform
            </a>
            <div className={style.divider} />
          </div>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
}
