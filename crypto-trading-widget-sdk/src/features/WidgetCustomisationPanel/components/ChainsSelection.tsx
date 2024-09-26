import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { Chain, chainConfigs } from '../../../utils/chains';
import { AVAILABLE_CHAINS } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks/reduxHooks';
import { TokenForSaleAutocomplete } from './TokenForSaleAutocomplete';
import { SelectedCheckBoxIcon } from '../../../components/Icons/SelectedCheckBoxIcon';
import { EmptyCheckBoxIcon } from '../../../components/Icons/EmptyCheckBoxIcon';
import { changeWidgetOptions } from '../../../redux/customisationSlice';

export const ChainsSelection: React.FC = () => {
  const theme = useTheme();
  const selectedChain = useAppSelector(({ app }) => app.selectedChain);
  const chainOptions = useAppSelector(({ customisation }) => customisation.options.chainOptions);

  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const changeChains = (event: React.ChangeEvent<HTMLInputElement>, chain: Chain) => {
    if (selectedChain && selectedChain === chain) {
      setError(`${chainConfigs[selectedChain].name} cannot be removed while selected as current`);
      return;
    }
    setError(null);

    const checked = event.target.checked;
    if (chainOptions) {
      dispatch(
        changeWidgetOptions({
          chainOptions: {
            ...chainOptions,
            [chain]: {
              enabled: checked,
              defaultTokenAddress: chainOptions[chain].defaultTokenAddress,
            },
          },
        })
      );
    }
  };

  return (
    <>
      <Grid container padding={0} margin={0}>
        {AVAILABLE_CHAINS.map(chain => (
          <Grid item xs={6} md={4} lg={3} key={chain}>
            <FormControlLabel
              control={
                <Checkbox
                  color={'primary'}
                  icon={<EmptyCheckBoxIcon />}
                  checkedIcon={<SelectedCheckBoxIcon />}
                  checked={chainOptions?.[chain].enabled}
                  onChange={e => changeChains(e, chain)}
                  name={chainConfigs[chain].name}
                />
              }
              label={chainConfigs[chain].name}
            />
          </Grid>
        ))}
      </Grid>
      {error && (
        <Typography variant={'body2'} color={theme.palette.error.main}>
          {error}
        </Typography>
      )}
      <Grid container spacing={2} marginTop={1}>
        <Grid item xs={12} marginBottom={1}>
          <Typography variant={'h6'}>{'Tokens'}</Typography>
          <Typography variant={'body1'}>
            {
              'You can search tokens by token symbol or address. Please reach customer support if you want to add custom token.'
            }
          </Typography>
        </Grid>
        {AVAILABLE_CHAINS.map(chain => (
          <>
            {chainOptions?.[chain].enabled && (
              <Grid item xs={12} lg={6} key={chainConfigs?.[chain].name}>
                <TokenForSaleAutocomplete chain={chain} />
              </Grid>
            )}
          </>
        ))}
      </Grid>
    </>
  );
};
