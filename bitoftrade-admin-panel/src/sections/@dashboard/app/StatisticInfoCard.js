// material
import { styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import PropTypes from 'prop-types';
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(1, 0)
}));

// ----------------------------------------------------------------------

StatisticInfoCard.propTypes = {
  label: PropTypes.string,
  amount: PropTypes.number
};

export default function StatisticInfoCard({ label, amount }) {
  return (
    <RootStyle>
      <Typography variant="h3">{fShortenNumber(amount)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {label}
      </Typography>
    </RootStyle>
  );
}
