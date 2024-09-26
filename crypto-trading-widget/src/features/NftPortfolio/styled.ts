import { Card, Container, styled, Box, Pagination } from '@mui/material';
import { MOBILE_BREAKPOINT_KEY } from '../../constants';
import CloseIcon from '@mui/icons-material/Close';

export const SContainer = styled(Container, {
  name: 'SContainer',
})(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundImage: 'url(/images/gradients/backGradient.svg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100%',
  backgroundPositionY: -340,
  backgroundPositionX: -80,
  [theme.breakpoints.down('lg')]: {
    backgroundPosition: 'center',
    backgroundSize: '180%',
  },
  [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
    backgroundPosition: 'top',
    backgroundSize: '280%',
  },
}));

export const SCardListWrapper = styled(Card, {
  name: 'SCardListWrapper',
})({
  position: 'relative',
  flex: '1 1 100%',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '618px',
});

export const SSelectedNftCard = styled(Card, {
  name: 'SSelectedNftCard',
})(({ theme }) => ({
  height: '100%',
  minHeight: '618px',
  overflow: 'auto',
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    width: theme.spacing(1),
  },
  '&::-webkit-scrollbar-track': {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: theme.spacing(1),
  },
}));

export const SModalContent = styled(Box, {
  name: 'SModalContent',
})(({ theme }) => ({
  border: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const SModalCloseIcon = styled(CloseIcon, { name: 'SModalCloseIcon' })({
  position: 'absolute',
  top: 25,
  right: 25,
  margin: 16,
  cursor: 'pointer',
});

export const SPagination = styled(Pagination, { name: 'SPagination' })(() => ({
  '& .MuiPaginationItem-root': {
    borderRadius: 1,
    margin: 0,
    width: 32,
  },
}));
