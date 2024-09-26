import { SSearchDiv, SearchIconWrapper, SInputBase } from './styled';
import SearchIcon from '@mui/icons-material/Search';
import { Token } from 'data/tokens/token.interface';
import { debounce } from '@mui/material';

interface TokenSearchBarProps {
  tokens: Token[];
  onFilteredTokensChange: (tokens: Token[]) => void;
}
export const TokenSearchBar: React.FC<TokenSearchBarProps> = ({ tokens, onFilteredTokensChange }) => {
  const handleInputChange = debounce((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onFilteredTokensChange(
      tokens.filter(token => token.symbol.toLowerCase().includes(event.target.value.toLowerCase()))
    );
  }, 800);

  return (
    <>
      <SSearchDiv>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <SInputBase
          placeholder="Search by token name..."
          inputProps={{ 'aria-label': 'search' }}
          onChange={handleInputChange}
        />
      </SSearchDiv>
    </>
  );
};
