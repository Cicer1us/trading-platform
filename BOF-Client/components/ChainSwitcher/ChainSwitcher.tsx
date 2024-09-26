import React, { useState } from 'react';
import { Chains, chains } from 'connection/chainConfig';
import { useWeb3React } from '@web3-react/core';
import style from './ChainSwitcher.module.css';
import ArrowDropdownIcon from '@/assets/icons/ArrowDropdownIcon';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { setCurrentChainId } from '@/redux/appSlice';
import { ChainIcon } from '../ChainIcon/ChainIcon';
import { getChainsForService } from '@/helpers/ChainSelectionHelpers';
import Popup from '../Popup/Popup';
import useMultilingual from '@/hooks/useMultilingual';
import { useRouter } from 'next/router';
import { TRADING } from '@/common/LocationPath';
import { ClipLoader } from 'react-spinners';
import { switchChain } from 'connection/switchChain';

const ChainSwitcher: React.FC = (): JSX.Element => {
  const { tc, t } = useMultilingual('header');
  const { connector } = useWeb3React();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chainId = useAppSelector(({ app }) => app.chainId);

  const tab = useAppSelector(({ widget }) => widget.tab);
  const router = useRouter();

  const isTradingPage = () => router.pathname.includes(TRADING);

  const dispatch = useAppDispatch();

  const onToggle = (e: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setOpenMenu(!openMenu);
  };

  const onChainSwitch = async (chainId: number): Promise<void> => {
    if (getChainsForService(tab, isTradingPage()).find(chain => chain === chainId)) {
      try {
        setIsLoading(true);
        await switchChain(connector, Number(chainId));
        dispatch(setCurrentChainId(chainId));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
  };

  return (
    <div
      className={`${style.wrapper} ${openMenu ? style.active : ''}`}
      onClick={onToggle}
      ref={(el): HTMLDivElement => el}
      tabIndex={0}
      onBlur={(e): void => {
        if (openMenu) onToggle(e);
      }}
    >
      <div className={`${style.wrapperInput}`}>
        <div className={style.networkIcon}>
          {isLoading ? <ClipLoader size={20} color={'var(--green)'} /> : <ChainIcon chainId={chainId} />}
        </div>
        <span className={style.inputView}>{chainId === Chains.GOERLI ? t(`testnet`) : chains[chainId]?.name}</span>
        <div className={style.arrow}>
          <ArrowDropdownIcon />
        </div>
      </div>
      {openMenu && (
        <ul className={`${style.menu} ${style['bottom']} scroll`}>
          {Object.values(chains)
            .sort((a, b) => a.displayPriority - b.displayPriority)
            .map((chain, i) => {
              const isActive = getChainsForService(tab, isTradingPage()).some(avChain => avChain === chain.chainId);
              const service = tab.toLowerCase();
              return (
                <Popup popupText={tc('notAvailable')([t(service)])} active={!isActive} key={chain.chainId}>
                  <li
                    key={`${chain.name}-${i}`}
                    className={`${style.option} ${isActive ? '' : style.unActive}`}
                    onClick={() => onChainSwitch(chain?.chainId)}
                  >
                    <ChainIcon chainId={chain?.chainId} />
                    <span className={style.title}>{chain.chainId === Chains.GOERLI ? t(`testnet`) : chain.name}</span>
                  </li>
                </Popup>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default ChainSwitcher;
