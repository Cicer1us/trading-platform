// material
import { Grid, LinearProgress, Typography } from '@mui/material';
// components
import PropTypes from 'prop-types';
import { StatisticInfoCard } from './index';

// ----------------------------------------------------------------------

StatisticCardsPack.propTypes = {
  title: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.number
    })
  )
};

export default function StatisticCardsPack({ title, values }) {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>
      {!values ? (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      ) : (
        values.map((elem) => (
          <Grid item xs={12} sm={6} md={3} key={title + elem.title}>
            <StatisticInfoCard label={elem.title} amount={elem.value} />
          </Grid>
        ))
      )}
    </>
  );
}
