import { LeverageMarketIcon } from '@/assets/icons/leverage/LeverageMarketIcon';
import { getTokenInfo } from '@/common/web3/Web3Manager';
import getDecimalsScale from '@/helpers/getDecimalsScale';
import { getMultipleBalances } from '@/helpers/getMultipleBalances';
import { Token } from '@/interfaces/Tokens.interface';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { BeatLoader } from 'react-spinners';
import Web3 from 'web3';
import CoinsImages from '../CoinsImages/CoinsImages';
import { InputSearch } from '../InputSearch/InputSearch';
import Modal from '../Modal/Modal';
import style from './SelectModal.module.css';
import { chains, Chains } from 'connection/chainConfig';
import { ChainIcon } from '../ChainIcon/ChainIcon';
import { MARKETS } from '@/common/LocationPath';

export interface SelectOption {
  title: string;
  subTitle?: string;
  iconSymbol?: string;
  isLeverageIcon?: boolean;
  balance?: number;
  address?: string;
}

export interface SelectFilter {
  id: string;
  title: string;
}

export interface CustomToken extends Token {
  balance: number;
}

interface SelectModalProps {
  title: string;
  options: SelectOption[];
  onOptionClick: (option: SelectOption) => void;
  isOpen: boolean;
  placeholder: string;
  onClose: () => void;
  filters?: SelectFilter[];
  activeFilter?: string;
  setFilter?: (filterId: string) => void;
  onCustomTokenClick?: (token: Token) => void;
  chainId: Chains;
  setTokensListChainId?: (tokensChainId: Chains) => void;
  availableChains?: Chains[];
}

export const SelectModal: React.FC<SelectModalProps> = ({
  title,
  isOpen,
  onClose,
  options,
  onOptionClick,
  placeholder,
  onCustomTokenClick,
  chainId,
  setTokensListChainId = null,
  availableChains = [],
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customToken, setCustomToken] = useState<CustomToken>(null);
  const [query, setQuery] = useState<string>('');
  const [filteredList, setFilteredList] = useState<SelectOption[]>(options);

  const clientAddress = useAppSelector(({ app }) => app.clientAddress);

  const createCustomToken = async (address: string) => {
    setIsLoading(true);
    const token = await getTokenInfo(address, chainId);
    if (token) {
      const balance = await getMultipleBalances(clientAddress, [token], chainId);
      setCustomToken({ ...token, balance: balance[token.address] });
    }
    setIsLoading(false);
  };

  const createOptionFromToken = (token: CustomToken): SelectOption => ({
    title: token.symbol,
    subTitle: token.name,
    iconSymbol: token.symbol,
    address: token.address,
    balance: token.balance,
  });

  const filterByAddress = (tokenAddress: string) => {
    const filteredList = options.filter(({ address }) => address && address?.toLocaleLowerCase() === tokenAddress);
    if (filteredList.length === 0 && createCustomToken) {
      createCustomToken(tokenAddress);
    } else {
      return setFilteredList(filteredList);
    }
  };

  const filterByTitle = (filter: string) => {
    const newFilteredList = options.filter(({ title }) => title.toLowerCase().includes(filter));
    return setFilteredList(newFilteredList);
  };

  const handleQuery = (queryFilter: string) => {
    setQuery(queryFilter);

    // reset custom token e.g. display token only for specific address in search
    if (customToken?.address && customToken.address !== queryFilter) {
      setCustomToken(null);
    }

    if (options?.length) {
      const filter = queryFilter.toLowerCase();
      if (Web3.utils.isAddress(filter)) {
        filterByAddress(filter);
      } else if (filter) {
        filterByTitle(filter);
      } else {
        return setFilteredList(options);
      }
    }
  };

  const onClick = (option: SelectOption) => {
    if (customToken && option?.address === customToken?.address) {
      onCustomTokenClick(customToken);
    } else {
      onOptionClick(option);
    }
  };

  useEffect(() => {
    handleQuery(query);
  }, [options]);

  const closeModal = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  const optionsToDisplay = customToken ? [createOptionFromToken(customToken)] : filteredList?.slice(0, 100);

  return (
    <Modal active={isOpen} setActive={closeModal} className={style.modal}>
      <div className={style.container}>
        <div className={style.search}>
          <div className={style.header}>
            <div className={style.titleContainer}>
              <h3 className={style.title}>{title}</h3>
            </div>
            {/*<div className={style.radioButtonsWrapper}>
              {!!filters?.length &&
                filters.map(({ id, title }) => (
                  <div className={style.radioButton} onClick={() => setFilter(id)} key={id}>
                    <div className={`${style.radioCircle} ${id === activeFilter ? style.checkedBuy : ''}`}>
                      {id == activeFilter && <div className={style.innerCircleBuy} />}
                    </div>
                    <span className={`${style.leverageSideTitle} ${id === activeFilter ? style.checked : ''}`}>
                      {title}
                    </span>
                  </div>
                ))}
                </div>*/}
          </div>
          <InputSearch
            value={query}
            onChange={({ target: { value } }) => handleQuery(value)}
            placeholder={placeholder}
          />
        </div>
        <div className={style.tokens}>
          <div className={style.chainsWrapper}>
            {setTokensListChainId &&
              availableChains.map((id, i) => {
                const chain = chains[id];
                const isActive = chain.chainId === chainId;
                return (
                  <div
                    key={`${chain.name}-${i}`}
                    className={`${style.chainOption} ${isActive ? style.selected : ''}`}
                    onClick={() => setTokensListChainId(chain.chainId)}
                  >
                    <ChainIcon chainId={chain?.chainId} />
                    <span className={style.chainTitle}>{chain.name}</span>
                  </div>
                );
              })}
          </div>
          <ul className={`${style.listContainer} scroll`}>
            {isLoading ? (
              <div className={style.loader}>
                <BeatLoader color={'var(--green)'} loading={true} size={15} />
              </div>
            ) : (
              <>
                {!!optionsToDisplay?.length &&
                  optionsToDisplay.map((option, index) => (
                    <li key={`${title}-${index}`} className={style.option} onClick={() => onClick(option)}>
                      {option.iconSymbol && (
                        <div>
                          {!option.isLeverageIcon && <CoinsImages symbol={option.iconSymbol} size={'24px'} />}
                          {option.isLeverageIcon && <LeverageMarketIcon market={option.iconSymbol} size={24} />}
                        </div>
                      )}
                      <div className={style.content}>
                        <div>
                          {option.title}
                          {option.subTitle && <span className={style.coinName}>{` - ${option.subTitle}`}</span>}
                        </div>
                        {/* <div>{option.balance && <span>{option.balance}</span>}</div> */}
                        <div className={style.balance}>
                          {option.balance && (
                            <NumberFormat
                              decimalScale={getDecimalsScale(option.balance)}
                              thousandSeparator
                              displayType="text"
                              value={option.balance}
                            />
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                {!optionsToDisplay?.length ? (
                  <span className={style.marketsMsg}>
                    We are sorry,can’t find this token. Please, check token in the{' '}
                    <a href={MARKETS} className={style.marketLink}>
                      market page
                    </a>
                    .
                  </span>
                ) : null}
              </>
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
};
