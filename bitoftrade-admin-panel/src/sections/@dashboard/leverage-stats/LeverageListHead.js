import PropTypes from 'prop-types';
// material
import { TableRow, TableCell, TableHead } from '@mui/material';

// ----------------------------------------------------------------------

LeverageListHead.propTypes = {
  headLabel: PropTypes.array
};

export default function LeverageListHead({ headLabel }) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.alignRight ? 'right' : 'left'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
