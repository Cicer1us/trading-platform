import { Paper, styled, Tabs } from '@mui/material';

export const STabs = styled(Tabs, {
  name: 'STabs',
})(({ theme }) => ({
  textTransform: 'none',
  '& .MuiButtonBase-root': {
    textTransform: 'none',
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    marginLeft: 12,
    marginRight: 12,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
}));

export const SPaper = styled(Paper, {
  name: 'SPaper',
})(({ theme }) => ({
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.secondary.main,
}));
