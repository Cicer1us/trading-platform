import { BoxProps, Box, styled } from '@mui/material';

export const SImageBox = styled((props: BoxProps<'img'>) => <Box {...props} />, { name: 'SImageBox' })({
  display: 'flex',
  flexShrink: 0,
  objectFit: 'cover',
  alignSelf: 'center',
  float: 'left',
  borderRadius: 8,
  backgroundColor: 'rgb(43, 54, 59)',
});
