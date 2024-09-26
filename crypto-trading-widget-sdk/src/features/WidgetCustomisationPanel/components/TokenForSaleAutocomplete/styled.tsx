import React from 'react';
import { styled, TextField } from '@mui/material';
import { Autocomplete, AutocompleteProps } from '@mui/material';
import { TokenBasicInfo } from '../../../../utils/chains';

export const SAutocomplete = styled(
  ({ ...props }: AutocompleteProps<TokenBasicInfo, boolean, boolean, undefined>) => <Autocomplete {...props} />,
  {
    name: 'SAutocomplete',
  }
)(({ theme }) => ({
  '& svg': {
    fill: theme.palette.secondary.light,
  },

  '& fieldset': {
    borderColor: theme.palette.secondary.light,
  },
}));

export const STextField = styled(TextField, {
  name: 'STextField',
})(({ theme }) => ({
  '& fieldset': {
    border: `2px solid ${theme.palette.secondary.light}`,
  },
  '&:hover': {
    '& svg': {
      fill: theme.palette.text.primary,
    },
  },
}));
