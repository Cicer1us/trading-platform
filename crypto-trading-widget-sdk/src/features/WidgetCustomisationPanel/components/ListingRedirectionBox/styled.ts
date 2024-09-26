import { styled, Paper } from '@mui/material';
export const SRedirectionBoxPaper = styled(Paper, {
  name: 'SRedirectionBoxPaper',
})(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  width: '424px',
  margin: 'auto',
  background: 'linear-gradient(195deg, #2c4b47 35%, #FF6666 150%)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
}));
