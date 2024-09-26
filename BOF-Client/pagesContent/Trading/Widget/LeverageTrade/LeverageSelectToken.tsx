import { clientManager } from '@/common/DydxClientManager';
import { Chains } from 'connection/chainConfig';
import { SelectModal, SelectOption } from '@/components/SelectModal/SelectModal';
import { leverageAssets } from '@/helpers/leverageTrade/constants';
import useMultilingual from '@/hooks/useMultilingual';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { setMarkets, setSelectedMarket } from '@/redux/leverageSlice';
import { TabsList } from '@/redux/redux.enum';
import { SelectTokenModal, setSelectTokenModal } from '@/redux/widgetSlice';
import React, { useEffect, useMemo } from 'react';

export const LeverageSelectToken = () => {
  const dispatch = useAppDispatch();
  const { t } = useMultilingual('widget');
  const markets = useAppSelector(({ leverage }) => leverage.markets);
  const selectedMarket = useAppSelector(({ leverage }) => leverage.selectedMarket);
  const selectTokenModal = useAppSelector(({ widget }) => widget.selectTokenModal);
  const tab = useAppSelector(({ widget }) => widget.tab);

  const loadLeverageTokens = async () => {
    const res = await clientManager.client.public.getMarkets();
    const options: string[] = ['BTC'];
    for (const value of Object.values(res.markets)) {
      const symbol = value.market.split('-')[0];
      const isLeverage = !!leverageAssets.find(lev => lev === symbol);
      if (isLeverage) options.push(symbol);
    }
    dispatch(setMarkets(Array.from(new Set(options))));
  };

  useEffect(() => {
    if (markets.length <= 1 && clientManager.client) loadLeverageTokens();
  }, [markets, clientManager.client]);

  const onOptionClick = (option: SelectOption) => {
    const market = option.title.split('-')[0];
    dispatch(setSelectedMarket(market));
    dispatch(setSelectTokenModal(SelectTokenModal.CLOSED));
  };

  const onClose = () => dispatch(setSelectTokenModal(SelectTokenModal.CLOSED));

  const options: SelectOption[] = useMemo(() => {
    return markets
      .filter(market => market !== selectedMarket)
      .map(market => {
        return {
          isLeverageIcon: true,
          title: `${market}`,
          ...(market ? { iconSymbol: market } : {}),
        };
      });
  }, [markets, selectedMarket]);

  return (
    <SelectModal
      chainId={Chains.MAINNET}
      title="Tokens"
      onClose={onClose}
      options={options}
      onOptionClick={onOptionClick}
      placeholder={t('leverageSelectPlaceholder')}
      isOpen={selectTokenModal !== SelectTokenModal.CLOSED && tab === TabsList.LEVERAGE}
    />
  );
};
