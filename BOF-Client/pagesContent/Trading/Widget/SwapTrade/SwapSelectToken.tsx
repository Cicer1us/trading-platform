import { CustomToken, SelectFilter, SelectModal, SelectOption } from '@/components/SelectModal/SelectModal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { TabsList, WidgetList } from '@/redux/redux.enum';
import {
  addCustomToken,
  longListSelector,
  SelectTokenModal,
  setSelectedTokenA,
  setSelectedTokenB,
  setSelectTokenModal,
  setWidgetList,
} from '@/redux/widgetSlice';
import topLists from '@/helpers/topLists';
import React, { useMemo } from 'react';
import useMultilingual from '@/hooks/useMultilingual';
import { Token } from '@/interfaces/Tokens.interface';
import { balancesSelector, setBalance } from '@/redux/appSlice';
import { useWeb3React } from '@web3-react/core';

export const SwapSelectToken = () => {
  const dispatch = useAppDispatch();
  const { t } = useMultilingual('widget');
  const chainId = useAppSelector(({ app }) => app.chainId);
  const balances = useAppSelector(balancesSelector);
  const tokens = useAppSelector(longListSelector);
  const widgetList = useAppSelector(({ widget }) => widget.list);
  const selectTokenModal = useAppSelector(({ widget }) => widget.selectTokenModal);
  const tokenA = useAppSelector(({ widget }) => widget.selectedTokenA);
  const tokenB = useAppSelector(({ widget }) => widget.selectedTokenB);
  const tab = useAppSelector(({ widget }) => widget.tab);
  const { account } = useWeb3React();

  const setModalToken = (token: Token) => {
    if (selectTokenModal === SelectTokenModal.FIRST_INPUT) {
      dispatch(setSelectedTokenA(token));
    } else if (selectTokenModal === SelectTokenModal.SECOND_INPUT) {
      dispatch(setSelectedTokenB(token));
    }
    dispatch(setSelectTokenModal(SelectTokenModal.CLOSED));
  };

  const onCustomTokenClick = (token: CustomToken) => {
    dispatch(addCustomToken({ token: token, chainId }));
    dispatch(setBalance({ chainId, address: token.address, balance: token.balance }));
    setModalToken(token);
  };

  const onOptionClick = (option: SelectOption) => {
    const token = tokens.find(t => t.address === option.address);
    setModalToken(token);
  };

  const onClose = () => dispatch(setSelectTokenModal(SelectTokenModal.CLOSED));
  const onFilter = (list: WidgetList) => dispatch(setWidgetList(list));

  const filters: SelectFilter[] = [
    { id: WidgetList.ALL, title: t('longTokensList') },
    { id: WidgetList.TOP, title: t('shortTokensList') },
  ];

  const topTokensList = useMemo((): Token[] => {
    const topTokens = [];
    for (const topToken of topLists[chainId] ?? []) {
      const token = tokens.find(t => t.symbol === topToken);
      if (token) topTokens.push(token);
    }
    return topTokens;
  }, [tokens]);

  const list = widgetList === WidgetList.ALL ? tokens : topTokensList;

  const options: SelectOption[] = useMemo((): SelectOption[] => {
    const tokenList = list.map(token => ({
      title: token.symbol,
      subTitle: token.name,
      iconSymbol: token.symbol,
      address: token.address,
      decimals: token.decimals,
      balance: balances[token.address],
    }));
    if (topLists[chainId]) {
      tokenList?.sort((a, b) => topLists[chainId].includes(b.title) - topLists[chainId].includes(a.title));
    }
    if (account) {
      tokenList?.sort((_, b) => (!b.balance ? -1 : 1));
    }
    return tokenList;
  }, [tokens, widgetList, tokenA, tokenB, balances, chainId]);

  return (
    <SelectModal
      chainId={chainId}
      onCustomTokenClick={onCustomTokenClick}
      filters={filters}
      activeFilter={widgetList}
      setFilter={onFilter}
      title="Tokens"
      onClose={onClose}
      options={options}
      onOptionClick={onOptionClick}
      placeholder={t('tokenSelectPlaceholder')}
      isOpen={selectTokenModal !== SelectTokenModal.CLOSED && tab === TabsList.SWAP}
    />
  );
};
