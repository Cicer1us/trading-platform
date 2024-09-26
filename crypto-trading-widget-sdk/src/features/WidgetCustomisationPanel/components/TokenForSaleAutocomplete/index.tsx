import React, { useMemo } from 'react';
import { Popper, styled } from '@mui/material';
import { getTokenList } from 'data/tokens/tokenLists';
import { matchSorter } from 'match-sorter';
import { Chain, chainConfigs, TokenBasicInfo } from 'utils/chains';
import { useAppDispatch, useAppSelector } from 'redux/hooks/reduxHooks';
import InputAdornment from '@mui/material/InputAdornment';
import { TokenImage } from 'components/TokenImage';
import { changeWidgetOptions } from 'redux/customisationSlice';
import { STextField, SAutocomplete } from './styled';

interface TokenForSaleAutocompleteProps {
  chain: Chain;
}

const StyledPopper = styled(Popper, {
  name: 'StyledPopper',
})(({ theme }) => ({
  [`& .MuiAutocomplete-listbox`]: {
    overflow: 'auto',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      width: theme.spacing(1),
    },
    '&::-webkit-scrollbar-track': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: theme.spacing(1),
    },
  },
}));

const SListElement = styled('li', { name: 'SListElement' })({ '& > img': { marginRight: 16, flexShrink: 0 } });
export const TokenForSaleAutocomplete: React.FC<TokenForSaleAutocompleteProps> = ({ chain }) => {
  const dispatch = useAppDispatch();
  const chainOptions = useAppSelector(({ customisation }) => customisation.options.chainOptions);
  const tokens = useAppSelector(({ app }) => app.tokenListMap[chain].tokens);

  const selectedToken = chainOptions?.[chain].defaultTokenAddress
    ? tokens[chainOptions[chain].defaultTokenAddress?.toLowerCase() ?? '']
    : undefined;

  const tokenAddressChanged = (newValue: TokenBasicInfo | null) => {
    if (newValue && chainOptions) {
      const value = newValue.address;
      dispatch(
        changeWidgetOptions({
          chainOptions: {
            ...chainOptions,
            [chain]: {
              enabled: chainOptions[chain].enabled,
              defaultTokenAddress: value,
            },
          },
        })
      );
    }
  };

  const tokenList = useMemo(() => getTokenList(chain), [chain]);

  return (
    <SAutocomplete
      PopperComponent={StyledPopper}
      disablePortal
      value={selectedToken}
      options={tokenList}
      getOptionLabel={option => option.symbol}
      filterOptions={(options, { inputValue }) =>
        matchSorter(options, inputValue, {
          keys: ['name', { threshold: matchSorter.rankings.STARTS_WITH, key: 'address' }],
        })
      }
      onChange={(e, newValue) => tokenAddressChanged(newValue as TokenBasicInfo)}
      isOptionEqualToValue={option => !!(option.symbol && option.logoURI)}
      renderOption={(props, option) => (
        <SListElement {...props} key={option.address}>
          <TokenImage style={{ width: '20px' }} src={option.logoURI} alt="" />
          {option.symbol}
        </SListElement>
      )}
      renderInput={params => (
        <STextField
          {...params}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <img loading="lazy" width="20" src={selectedToken?.logoURI} alt="" />
              </InputAdornment>
            ),
          }}
          label={chainConfigs[chain].name}
          color={'primary'}
        />
      )}
      fullWidth
    />
  );
};
