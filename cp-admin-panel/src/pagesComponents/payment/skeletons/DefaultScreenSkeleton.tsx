import { Skeleton, Box } from '@mui/material';

export const PaymentDefaultScreenSkeleton: React.FC = () => (
  <>
    <Skeleton variant='rounded' width={'100%'} height={68} />
    <Skeleton variant='rounded' width={'100%'} height={90} />
    <Box display={'flex'} gap={2}>
      <Skeleton variant='rounded' width={'100%'} height={57} />
      <Skeleton variant='rounded' width={'100%'} height={57} />
    </Box>
    <Skeleton variant='rounded' width={'100%'} height={90} />
    <Skeleton variant='rounded' width={'100%'} height={134} />
  </>
);
