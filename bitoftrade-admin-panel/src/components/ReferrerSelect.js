import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';
import { Referrer } from '../pages/DashboardApp';

ReferrerSelect.propTypes = {
  referrer: PropTypes.string,
  setReferrer: PropTypes.func
};

export default function ReferrerSelect({ referrer, setReferrer }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="referrer-select-label">Referrer</InputLabel>
      <Select
        labelId="referrer-select-label"
        id="referrer-select"
        value={referrer}
        label="Referrer"
        onChange={(e) => setReferrer(e.target.value)}
      >
        <MenuItem value={Referrer.All}>All</MenuItem>
        <MenuItem value={Referrer.Bitoftrade}>Bitoftrade</MenuItem>
        <MenuItem value={Referrer.AllpayWidget}>Allpay widget</MenuItem>
      </Select>
    </FormControl>
  );
}
