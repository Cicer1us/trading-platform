import React, { useMemo, useState } from 'react';
import {
  addCustomToken,
  SelectTokenModal,
  setSelectedTokenA,
  setSelectedTokenB,
  setSelectTokenModal,
} from '@/redux/widgetSlice';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { CustomToken, SelectModal, SelectOption } from '@/components/SelectModal/SelectModal';
import useMultilingual from '@/hooks/useMultilingual';
import { setBalance } from '@/redux/appSlice';
import { TabsList } from '@/redux/redux.enum';
import { Token } from '@/interfaces/Tokens.interface';
import { useDispatch } from 'react-redux';
import { Chains } from 'connection/chainConfig';
import { availableChainsCrossSwap } from '@/common/constants';
import { useWeb3React } from '@web3-react/core';
import topLists from '@/helpers/topLists';

const CrossChainSelectToken = (): JSX.Element => {
  const { t } = useMultilingual('crosschainModal');

  const [selectedChainId, setSelectedChainId] = useState<Chains>(null);

  const balances = useAppSelector(({ app }) => app.balances);

  const srcToken = useAppSelector(({ widget }) => widget.selectedTokenA);
  const destToken = useAppSelector(({ widget }) => widget.selectedTokenB);
  const selectTokenModal = useAppSelector(({ widget }) => widget.selectTokenModal);
  const tokensList = useAppSelector(({ widget }) => widget.tokensList);
  const tab = useAppSelector(({ widget }) => widget.tab);
  const { account } = useWeb3React();

  const dispatch = useDispatch();

  const options: Record<number, SelectOption[]> = useMemo((): Record<number, SelectOption[]> => {
    const tokens = {};
    Object.keys(tokensList).forEach(chainId => {
      const tokenList = tokensList[chainId].map(token => ({
        title: token.symbol,
        subTitle: token.name,
        iconSymbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        balance: balances[chainId]?.[token.address],
      }));
      if (topLists[chainId]) {
        tokenList?.sort((a, b) => topLists[chainId].includes(b.title) - topLists[chainId].includes(a.title));
      }
      if (account) {
        tokenList?.sort((_, b) => (!b.balance ? -1 : 1));
      }

      tokens[chainId] = tokenList;
    });
    return tokens;
  }, [balances]);

  const setModalToken = (token: Token) => {
    if (selectTokenModal === SelectTokenModal.FIRST_INPUT) {
      dispatch(setSelectedTokenA(token));
    } else if (selectTokenModal === SelectTokenModal.SECOND_INPUT) {
      dispatch(setSelectedTokenB(token));
    }

    dispatch(setSelectTokenModal(SelectTokenModal.CLOSED));
  };

  const onCustomTokenClick = (token: CustomToken) => {
    dispatch(addCustomToken({ token: token, chainId: token.chainId }));
    dispatch(setBalance({ chainId: token.chainId, address: token.address, balance: token.balance }));
    setModalToken(token);
  };

  const onOptionClick = (option: SelectOption) => {
    const token = tokensList[chainId].find(t => t.address === option.address);
    setModalToken(token);
  };

  const onClose = () => {
    setSelectedChainId(null);
    dispatch(setSelectTokenModal(SelectTokenModal.CLOSED));
  };

  const chainId =
    selectedChainId ?? (selectTokenModal === SelectTokenModal.FIRST_INPUT ? srcToken?.chainId : destToken?.chainId);

  return (
    <>
      <SelectModal
        chainId={chainId}
        setTokensListChainId={setSelectedChainId}
        onCustomTokenClick={onCustomTokenClick}
        title="Chains and Tokens"
        onClose={onClose}
        options={options[chainId]}
        onOptionClick={onOptionClick}
        placeholder={t('tokenSelectPlaceholder')}
        isOpen={selectTokenModal !== SelectTokenModal.CLOSED && tab === TabsList.CROSS_CHAIN}
        availableChains={availableChainsCrossSwap}
      />
    </>
  );
};

export default CrossChainSelectToken;
