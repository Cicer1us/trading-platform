import { FormHelperText, OutlinedInput, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { NumberFormatForDateInput } from 'components/AssetInput/NumberFormatCustom';
import { CustomSelect } from 'components/CustomSelect';
import { ErrorIcon } from 'components/Icons/ErrorIcon';
import { ManipulateType } from 'dayjs';

export interface DurationInputError {
  message: string;
  severity: 'error' | 'warning';
}

interface DurationInputProps {
  amount: string;
  selectedUnit: ManipulateType;
  unitsArray: string[];
  onAmountChange: (amount: string) => void;
  onUnitsChange: (unit: ManipulateType) => void;
  error?: DurationInputError;
}

export const DurationInput: React.FC<DurationInputProps> = ({
  amount,
  selectedUnit,
  unitsArray,
  onAmountChange,
  onUnitsChange,
  error,
}) => {
  const theme = useTheme();

  return (
    <Grid container display={'flex'} marginBottom={3} spacing={1}>
      <Grid item xs={6}>
        <OutlinedInput
          value={amount}
          error={error && error.severity === 'error'}
          onChange={e => onAmountChange(e.target.value)}
          fullWidth
          inputComponent={NumberFormatForDateInput as never}
          sx={{
            backgroundColor: muiTheme => muiTheme.palette.secondary.main,
            '& input': { maxHeight: '-webkit-fill-available' },
          }}
        />
        <FormHelperText
          error
          sx={{
            display: 'flex',
            stroke: error?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light,
            color: error?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light,
            height: '20px',
          }}
        >
          {error && <ErrorIcon />}
          {error?.message}
        </FormHelperText>
      </Grid>

      <Grid item xs={6}>
        <CustomSelect
          items={unitsArray}
          onChange={event => onUnitsChange(event.target.value as ManipulateType)}
          selected={selectedUnit}
        />
      </Grid>
    </Grid>
  );
};
