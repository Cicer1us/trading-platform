import { Box, TextField, IconButton, styled } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface PaymentsTableSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
}

const StyledTextField = styled(TextField, {
  name: 'StyledTextField'
})({
  maxWidth: 400
});

export const PaymentsTableSearch: React.FC<PaymentsTableSearchProps> = ({ query, onQueryChange }) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value.toLowerCase());
  };

  return (
    <Box p={5}>
      <StyledTextField
        fullWidth
        size={'small'}
        placeholder={'Search by Payment ID...'}
        value={query}
        onChange={onChange}
        InputProps={{
          endAdornment: !!query.length && (
            <IconButton size='small' onClick={() => onQueryChange('')}>
              <ClearIcon fontSize='small' />
            </IconButton>
          )
        }}
      />
    </Box>
  );
};
