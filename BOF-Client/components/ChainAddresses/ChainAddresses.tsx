import ArrowDropdownIcon from '@/assets/icons/ArrowDropdownIcon';
import { CopyIconSecondary } from '@/assets/icons/InputIcons';
import { chains } from 'connection/chainConfig';
import CutCenter from '@/helpers/CutCenter';
import useMultilingual from '@/hooks/useMultilingual';
import { TokenChain } from '@/interfaces/Tokens.interface';
import React, { useState } from 'react';
import { ChainIcon } from '../ChainIcon/ChainIcon';
import style from './ChainAddresses.module.css';

interface ChainAddressesProps {
  addresses: TokenChain[];
  title: string;
}

export const ChainAddresses: React.FC<ChainAddressesProps> = ({ addresses, title }) => {
  const { t } = useMultilingual('header');
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [showCopiedAlert, setShowCopiedAlert] = useState<boolean>(false);

  const onToggle = (e: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setOpenMenu(!openMenu);
  };

  const copy = (copyData: string) => {
    navigator.clipboard.writeText(copyData);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 1000);
  };

  return (
    <div
      className={`${style.wrapper} ${openMenu ? style.active : ''}`}
      tabIndex={0}
      onBlur={(e): void => {
        if (openMenu) onToggle(e);
      }}
    >
      <div className={`${style.wrapperInput}`} onClick={onToggle}>
        <div>{showCopiedAlert ? t('copied') : title}</div>
        <div className={style.arrow}>
          <ArrowDropdownIcon />
        </div>
      </div>
      {openMenu && (
        <ul className={`${style.menu} ${style['bottom']} scroll`}>
          {addresses.map(({ address, chainId }, i) => {
            return (
              <li key={`${address}-${i}`} className={`${style.option}`}>
                <div>
                  <ChainIcon chainId={chainId} />
                </div>
                <div className={style.addresses}>
                  <div className={style.title}>{chains[chainId].name}</div>
                  <div className={style.address}>{CutCenter(address, 6)}</div>
                </div>
                <div className={style.copy} onClick={() => copy(address)}>
                  <CopyIconSecondary />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
