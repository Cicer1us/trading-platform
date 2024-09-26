import { Skeleton, styled } from '@mui/material';

export const SPortfolioSkeleton = styled(Skeleton, {
  name: 'SPortfolioSkeleton',
})(({ theme }) => ({
  borderRadius: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

export const SOrdersListSkeleton = styled(Skeleton, {
  name: 'SOrdersListSkeleton',
})(({ theme }) => ({
  borderRadius: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));
