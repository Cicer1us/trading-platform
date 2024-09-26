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
import { ALLPAY, CROSS_CHAIN_MSG_DOCS, TRADING } from '@/common/LocationPath';

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
            <a href={CROSS_CHAIN_MSG_DOCS} className={style.link}>
              Cross chain messaging
            </a>
            <div className={style.divider} />
            <div className={style.category}>For business</div>
            <a href={ALLPAY} className={style.link}>
              AllPay Widget
            </a>
            <div className={style.divider} />
            <div className={style.category}>For traders</div>
            <a href={TRADING} className={style.link}>
              Trading platform
            </a>
            <div className={style.divider} />
          </div>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
}
