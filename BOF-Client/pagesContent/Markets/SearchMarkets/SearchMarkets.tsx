import { CoinMarketGlobal, CoinMarketToken } from '@/interfaces/Markets.interface';
import React, { useState } from 'react';
import { InputDropdownSearch } from '@/components/InputSearch/InputSearch';
import style from './SearchMarkets.module.css';
import { leverageAssets } from '@/helpers/leverageTrade/constants';
import { MarketSearchSection } from './SearchToken';
import { BASIC_LEVERAGE_TOKEN } from '@/common/LeverageTradeConstants';
import { MARKETS, TRADING_LEVERAGE } from '@/common/LocationPath';
import { SearchInfo } from './SearchInfo';
import useMultilingual from '@/hooks/useMultilingual';

interface SearchMarketsProps {
  tokens: CoinMarketToken[];
  global: CoinMarketGlobal;
}

export const SearchMarkets: React.FC<SearchMarketsProps> = ({ tokens, global }) => {
  const { t } = useMultilingual('markets');
  const [query, setQuery] = useState<string>('');

  const handleQuery = (queryFilter: string) => {
    setQuery(queryFilter);
  };

  const searchResults = tokens
    .filter(token => !!query && token.symbol.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.symbol?.length - b.symbol?.length)
    .slice(0, 100);

  const leverageResults = leverageAssets
    .filter(lev => !!query && lev.includes(query.toUpperCase()))
    .map(lev => tokens.find(t => t.symbol === lev));

  return (
    <div className={style.search}>
      <SearchInfo global={global} />
      <div className={style.searchContainer}>
        <InputDropdownSearch
          value={query}
          onChange={({ target: { value } }) => handleQuery(value)}
          placeholder={t('searchPlaceholder')}
        >
          {!!leverageResults.length || !!searchResults.length ? (
            <div className={`${style.dropdown} scroll`}>
              {!!leverageResults.length && (
                <MarketSearchSection
                  tokens={leverageResults}
                  title={t('leverageTrading')}
                  href={(token: CoinMarketToken) => `${TRADING_LEVERAGE}/${token.symbol}/${BASIC_LEVERAGE_TOKEN}`}
                />
              )}
              {!!searchResults.length && (
                <MarketSearchSection
                  tokens={searchResults}
                  title={t('searchResult')}
                  href={(token: CoinMarketToken) => `${MARKETS}/${token.id}`}
                />
              )}
            </div>
          ) : (
            !!query && (
              <div className={`${style.placeholder} ${style.dropdown}`}>
                <div>{t('nothingToShow')}</div>
              </div>
            )
          )}
        </InputDropdownSearch>
      </div>
    </div>
  );
};
