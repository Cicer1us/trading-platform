import { chains, Chains } from 'connection/chainConfig';
import { CustomToken, SelectModal, SelectOption } from '@/components/SelectModal/SelectModal';
import useMultilingual from '@/hooks/useMultilingual';
import { Token } from '@/interfaces/Tokens.interface';
import { balancesSelector, setBalance } from '@/redux/appSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { TabsList } from '@/redux/redux.enum';
import {
  addCustomToken,
  SelectTokenModal,
  setSelectedTokenA,
  setSelectedTokenB,
  setSelectTokenModal,
} from '@/redux/widgetSlice';
import React, { useMemo } from 'react';

export const LimitSelectToken = () => {
  const dispatch = useAppDispatch();
  const { t } = useMultilingual('widget');
  const tokens = useAppSelector(({ widget }) => widget.tokensList);
  const selectTokenModal = useAppSelector(({ widget }) => widget.selectTokenModal);
  const balances = useAppSelector(balancesSelector);
  const tokenA = useAppSelector(({ widget }) => widget.selectedTokenA);
  const tokenB = useAppSelector(({ widget }) => widget.selectedTokenB);
  const tab = useAppSelector(({ widget }) => widget.tab);
  const chainId = Chains.MAINNET;
  const mainnetTokens = tokens[chainId];
  const nativeToken = chains[chainId].nativeToken.symbol;

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
    const token = mainnetTokens.find(t => t.address === option.address);
    setModalToken(token);
  };

  const options: SelectOption[] = useMemo(() => {
    return mainnetTokens
      .filter(t => t.symbol !== nativeToken)
      .map(token => ({
        title: token.symbol,
        subTitle: token.name,
        iconSymbol: token.symbol,
        address: token.address,
        balance: balances[token.address],
      }))
      .sort((a, b) => (!b.balance ? -1 : 1));
  }, [tokens, tokenA, tokenB, balances]);

  const onClose = () => dispatch(setSelectTokenModal(SelectTokenModal.CLOSED));

  return (
    <SelectModal
      chainId={chainId}
      onCustomTokenClick={onCustomTokenClick}
      title="Tokens"
      onClose={onClose}
      options={options}
      onOptionClick={onOptionClick}
      placeholder={t('tokenSelectPlaceholder')}
      isOpen={selectTokenModal !== SelectTokenModal.CLOSED && tab === TabsList.LIMIT}
    />
  );
};
