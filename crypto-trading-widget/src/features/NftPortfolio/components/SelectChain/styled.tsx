import { FormControl, Typography, Select, SelectProps, styled } from '@mui/material';
import { Chain } from 'utils/chains';

export const SFormControl = styled(FormControl, {
  name: 'SFormControl',
})(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: 120,
  },
}));

export const SSelectChain = styled(({ ...props }: SelectProps<Chain>) => <Select {...props} />, {
  name: 'SSelect',
})(({ theme }) => ({
  maxHeight: 40,
  fontWeight: 700,
  stroke: theme.palette.text.primary,
  backgroundColor: theme.palette.secondary.main,
  [theme.breakpoints.down('sm')]: {
    maxHeight: 32,
  },
}));

export const SMenuItemContent = styled('div', {
  name: 'SMenuItemContent',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const STypography = styled(Typography, {
  name: 'STypography',
})(({ theme }) => ({
  marginRight: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));
