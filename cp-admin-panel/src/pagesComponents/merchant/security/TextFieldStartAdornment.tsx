import { Box, Typography } from '@mui/material';

export const TextFieldStartAdornment: React.FC = () => (
  <Box display={'flex'} alignItems={'center'} gap={2} paddingRight={3}>
    <Typography fontWeight={700} color={'text.secondary'}>
      URL
    </Typography>
  </Box>
);
