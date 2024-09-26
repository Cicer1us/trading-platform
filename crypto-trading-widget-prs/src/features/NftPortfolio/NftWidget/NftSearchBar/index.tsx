import { useDeferredValue, useTransition } from 'react';
import { FormControl, Grid, Icon, MenuItem, SelectChangeEvent, Typography, useMediaQuery } from '@mui/material';
import { SMenuItemContent } from '../../components/SelectChain/styled';
import { DropDownIcon } from 'components/Icons/DropDownIcon';
import { useEffect, useState } from 'react';
import { useBreakpoints } from 'utils/hooks/useBreakpoints';
import { SGridDropDown, SSearchNftInput, SSelectOrder, SStartInputAdornmentWrapper, STypographyTitle } from './styled';
import SearchIcon from '@mui/icons-material/Search';
import {
  FilterByOrder,
  ManageNftSearchFilters,
  filterByOrderOptions,
} from 'features/NftPortfolio/hooks/useNftSearchFilters';

export const NftSearchBar = ({ manageNftSearchFilters }: { manageNftSearchFilters: ManageNftSearchFilters }) => {
  const { setNftsSearchFilters, nftsSearchFilters } = manageNftSearchFilters;
  const { filterByOrderOption, searchQuery } = nftsSearchFilters;
  const startTransition = useTransition()[1];

  const handleFilterByOrderChange = (event: SelectChangeEvent) => {
    const order = event.target.value as FilterByOrder;
    if (!filterByOrderOptions.includes(order)) return;
    setNftsSearchFilters({ ...nftsSearchFilters, filterByOrderOption: order });
  };

  const [searchValueCurrent, setSearchValueCurrent] = useState<string>(searchQuery || '');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQueryFromInput = event.target.value;
    setSearchValueCurrent(searchQueryFromInput);
  };
  const deferredQuery = useDeferredValue(searchValueCurrent);
  useEffect(() => {
    startTransition(() => {
      setNftsSearchFilters({ ...nftsSearchFilters, searchQuery: deferredQuery });
    });
  }, [deferredQuery, nftsSearchFilters, startTransition, setNftsSearchFilters]);

  const { isMobile } = useBreakpoints();

  const isVerySmallScreen = useMediaQuery('(max-width:420px)');

  const GridSearchComponent = (
    <Grid item xs={12} sm={12} md={4} ml="auto">
      <SSearchNftInput
        fullWidth
        placeholder="Search your NFT"
        value={searchValueCurrent}
        onChange={handleSearchChange}
        startAdornment={
          <SStartInputAdornmentWrapper>
            <SearchIcon />
          </SStartInputAdornmentWrapper>
        }
      />
    </Grid>
  );

  return (
    <Grid container spacing={2} mt={-2}>
      <Grid container spacing={2} mt={0} ml={0} flexWrap="nowrap">
        {!isVerySmallScreen && (
          <Grid item xs={'auto'}>
            <STypographyTitle variant={'h5'} fontWeight={700} marginBottom={3}>
              {'NFT portfolio'}
            </STypographyTitle>
          </Grid>
        )}

        {!isMobile && GridSearchComponent}

        <SGridDropDown item xs={'auto'} sm={6} md={2}>
          <FormControl fullWidth>
            <SSelectOrder
              value={filterByOrderOption}
              onChange={handleFilterByOrderChange}
              IconComponent={props => (
                <Icon {...props}>
                  <DropDownIcon />
                </Icon>
              )}
            >
              {filterByOrderOptions.map(option => (
                <MenuItem value={option} key={option}>
                  <SMenuItemContent>
                    <Typography variant={'body1'} fontWeight={700} fontSize={14}>
                      {option}
                    </Typography>
                  </SMenuItemContent>
                </MenuItem>
              ))}
            </SSelectOrder>
          </FormControl>
        </SGridDropDown>
      </Grid>

      {isMobile && GridSearchComponent}
    </Grid>
  );
};
