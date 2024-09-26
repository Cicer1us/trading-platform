import { Box, Grid, OutlinedInput, Select, SelectProps, Typography, styled } from '@mui/material';

export const SSearchNftInput = styled(OutlinedInput)(({ theme }) => ({
  fontSize: 14,
  height: '40px',
  fontWeight: 400,
  backgroundColor: theme.palette.secondary.main,
}));

export const SSelectOrder = styled(({ ...props }: SelectProps<string>) => <Select {...props} />, {
  name: 'SSelectOrder',
})(({ theme }) => ({
  height: '40px',
  fontWeight: 700,
  fontSize: 14,
  stroke: theme.palette.text.primary,
  backgroundColor: theme.palette.secondary.main,
}));

export const SGridDropDown = styled(Grid, {
  name: 'SGridSearch',
})(({ theme }) => ({
  minWidth: '170px',
  [theme.breakpoints.down('md')]: {
    marginLeft: 'auto',
  },
}));

export const STypographyTitle = styled(Typography, {
  name: 'SGridSearch',
})(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: '1.2rem',
  },
}));

export const SStartInputAdornmentWrapper = styled(Box, {
  name: 'SStartInputAdornmentWrapper',
})(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginTop: theme.spacing(1),
}));
