import { IconButton, Menu, MenuItem, styled, Typography, OutlinedInput } from '@mui/material';
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { PrimaryButton } from 'src/@core/components/buttons/PrimaryButton';

export const StyledToggleButton = styled(IconButton, {
  name: 'StyledToggleButton'
})(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white
}));

export const StyledMenu = styled(Menu, {
  name: 'StyledMenu'
})({ '& .MuiMenu-paper': { width: 260, marginTop: 6 } });

export const StyledMenuItem = styled(MenuItem, {
  name: 'StyledMenuItem'
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

export const SHelpOutlineIcon = styled(HelpOutlineIcon, {
  name: 'HelpOutlineIcon'
})(({ theme }) => ({
  color: theme.palette.grey['700'],
  fontSize: theme.spacing(5)
}));

export const StyledSlipPageButton = styled(PrimaryButton, {
  name: 'StyledSlipPageButton'
})(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontSize: '0.75rem',
  fontWeight: 400,
  '&:hover': {
    backgroundColor: theme.palette.success.main
  }
}));

export const StyledErrorText = styled(Typography, {
  name: 'ErrorText'
})(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.75rem'
}));

export const SOutlinedInput = styled(OutlinedInput, {
  name: 'OutlinedInput'
})(({ theme }) => ({
  gridColumn: '1 / 4',
  height: '2.375rem',
  background: theme.palette.background.default,
  textAlign: 'center',
  outline: 'none'
}));

export const SSlipPageButtonGridItem = styled(StyledSlipPageButton, {
  name: 'StyledSlipPageButton'
})(() => ({
  gridColumn: '1 / 4'
}));
