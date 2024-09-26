import * as React from 'react';
import { useState } from 'react';
import { Token } from 'data/tokens/token.interface';
import { WidgetScreen } from '../../features/NftPortfolio/NftWidget/NftWidget';
import { useTokensToDisplay } from 'hooks/useTokensToDisplay';
import { TokenSearchBar } from './TokenSearchBar';
import { TokensToDisplay } from './TokensToDisplay';
import { useEscapeKeyListener } from 'hooks/useEscapeKeyListener';

interface TokenSearchProps {
  onSelect: (token: Token) => void;
  setWidgetScreen: (screen: WidgetScreen) => void;
}

export const TokenSearch: React.FC<TokenSearchProps> = ({ onSelect, setWidgetScreen }) => {
  const { tokens, tokensIsLoading } = useTokensToDisplay();
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens);

  useEscapeKeyListener(() => setWidgetScreen(WidgetScreen.Default));

  return (
    <>
      <TokenSearchBar tokens={tokens} onFilteredTokensChange={setFilteredTokens} />
      <TokensToDisplay tokensIsLoading={tokensIsLoading} filteredTokens={filteredTokens} onSelect={onSelect} />
    </>
  );
};
