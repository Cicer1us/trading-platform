import { InputBase, Box, Typography, ButtonBase, styled } from '@mui/material';

export const SSearchInputWrapper = styled('div', {
  name: 'SSearchInputWrapper',
})(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  marginLeft: 0,
  marginBottom: 10,
  width: '100%',
  svg: {
    fontSize: 24,
  },
}));

export const SearchIconWrapper = styled('div', {
  name: 'SearchIconWrapper',
})(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase, {
  name: 'StyledInputBase',
})(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: 14,
  },
}));

export const StyledBox = styled(Box, {
  name: 'StyledBox',
})(({ theme }) => ({
  position: 'relative',
  height: '100%',
  overflow: 'auto',
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    width: theme.spacing(1),
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: theme.spacing(1),
  },
}));

export const SNoTokensTypography = styled(Typography, {
  name: 'SNoTokensTypography',
})({
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  width: 'max-content',
});

export const SSelectTokenButton = styled(ButtonBase, {
  name: 'SSelectTokenButton',
})(({ theme }) => ({
  width: '100%',
  height: '48px',
  padding: 0.5,
  paddingRight: 1,
  justifyContent: 'left',
  '&.MuiButtonBase-root': {
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));
