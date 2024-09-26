import { BASIC_LEVERAGE_TOKEN } from '@/common/LeverageTradeConstants';
import { TRADING_LEVERAGE, TRADING_SWAP } from '@/common/LocationPath';
import { Chains, chains } from 'connection/chainConfig';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import { filterAvailableMarketChains } from '@/helpers/getAvailableMarketChains';
import { leverageAssets } from '@/helpers/leverageTrade/constants';
import useMultilingual from '@/hooks/useMultilingual';
import { CoinMarketMetadata } from '@/interfaces/Markets.interface';
import { USDC_ADDRESS } from 'constants/tokens';
import React from 'react';
import style from './MarketLinks.module.css';

interface MarketLinksProps {
  metadata: CoinMarketMetadata;
}

export const MarketLinks: React.FC<MarketLinksProps> = ({ metadata }) => {
  const { t } = useMultilingual('markets');
  const isLeverage = leverageAssets.some(lev => lev === metadata.symbol);
  const chains = filterAvailableMarketChains(metadata.contract_address);
  const address = chains[0]?.address;
  const chainId = chains[0]?.chainId;

  return (
    <div className={style.container}>
      {isLeverage && (
        <a
          href={`${TRADING_LEVERAGE}/${metadata.symbol}/${BASIC_LEVERAGE_TOKEN}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ButtonSimple>{t('leverageButton')}</ButtonSimple>
        </a>
      )}
      {address && chainId && (
        <a href={`${TRADING_SWAP}/${USDC_ADDRESS[chainId]}/${address}`} target="_blank" rel="noopener noreferrer">
          <ButtonSimple>{t('swapButton')}</ButtonSimple>
        </a>
      )}
    </div>
  );
};
