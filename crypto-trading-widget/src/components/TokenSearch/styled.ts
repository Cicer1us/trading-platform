import { Box, ButtonBase, InputBase, styled } from '@mui/material';

export const SSearchDiv = styled('div')(({ theme }) => ({
  marginBottom: 10,
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  marginLeft: 0,
  width: '100%',
  svg: {
    fontSize: 24,
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const SInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: 14,
  },
}));

export const SButtonBase = styled(ButtonBase)(({ theme }) => ({
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

export const SBox = styled(Box)(({ theme }) => ({
  height: '78%',
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
