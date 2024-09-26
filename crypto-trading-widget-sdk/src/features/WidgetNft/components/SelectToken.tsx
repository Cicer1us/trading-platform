import React from 'react';
import { SelectWithIcon } from '../../../components/SelectWithIcon';
import { Chain } from '../../../utils/chains';
import { useTokenList } from '../../../hooks/useTokenList';

interface SelectTokenProps {
  chain: Chain;
  selectedTokenAddress: string;
  onSelect: (tokenAddress: string) => void;
}

export const SelectToken: React.FC<SelectTokenProps> = ({ chain, onSelect, selectedTokenAddress }) => {
  const { data: tokenList } = useTokenList(chain);

  const items = Object.values(tokenList ?? {}).map(token => {
    return {
      name: token.name,
      image: token.logoURI,
      value: token.address,
    };
  });

  return <SelectWithIcon items={items} onSelect={onSelect} selectedValue={selectedTokenAddress} />;
};
