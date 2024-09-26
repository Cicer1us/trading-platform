import React, { useContext } from 'react';
import { Chain, chainConfigs } from 'utils/chains';
import { WalletCtx } from 'context/WalletContext';
import { useAppSelector } from 'redux/hooks/reduxHooks';
import { SelectWithIcon } from 'components/SelectWithIcon';

export const SelectChain: React.FC = () => {
  const ctx = useContext(WalletCtx);
  const selectedChain = useAppSelector(({ app }) => app.selectedChain);
  const chainList = useAppSelector(({ app }) => app.chainList);

  const handleChange = (value: Chain) => {
    ctx?.selectChain(value);
  };

  const items = chainList.map(chain => {
    return {
      name: chainConfigs[chain].name,
      image: chainConfigs[chain].image,
      value: chain,
    };
  });

  return <SelectWithIcon items={items} onSelect={handleChange} selectedValue={selectedChain} />;
};
