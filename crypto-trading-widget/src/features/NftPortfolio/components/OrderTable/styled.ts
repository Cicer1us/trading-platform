import { Paper, TableContainer, TablePagination, TablePaginationProps, styled } from '@mui/material';
import { palette } from 'theme/palette';

export const STablePaper = styled(Paper, {
  name: 'STablePaper',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(3),
  width: '100%',
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  '.MuiToolbar-root': {
    paddingLeft: 0,
  },
}));

export const STableContainer = styled(TableContainer, { name: 'TableContainer' })(() => ({
  flexGrow: 1,
}));

export const STablePagination = styled(TablePagination, {
  name: 'STablePagination',
})<TablePaginationProps>(() => ({
  overFlowY: 'hidden',
  '.MuiSvgIcon-root': {
    color: palette.text.primary,
  },
})) as typeof TablePagination;
