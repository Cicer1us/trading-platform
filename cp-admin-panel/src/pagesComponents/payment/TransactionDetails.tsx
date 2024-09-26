import { Box, Typography, styled, Skeleton } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { usePaymentPrice } from 'src/hooks/usePayment';
import { usePaymentCondition } from 'src/hooks/usePaymentCondition';

export const StyledTransactionDetailsWrapper = styled(Box, {
  name: 'StyledTransactionDetailsWrapper'
})(({ theme }) => ({
  padding: theme.spacing(5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius
}));

export const TransactionDetails: React.FC = () => {
  const { data: orderPrice } = usePaymentPrice();
  const { isLoading } = usePaymentCondition();

  return (
    <StyledTransactionDetailsWrapper>
      <Typography variant='subtitle1' fontWeight={700} mb={4}>
        {'Transaction details'}
      </Typography>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant='body2'>{'Estimated gas fee'}</Typography>

        <Typography variant='body2'>
          {isLoading ? (
            <Skeleton width={72} />
          ) : (
            <>
              <NumericFormat value={orderPrice?.estimatedGasCostUSD} displayType={'text'} decimalScale={4} /> {'USD'}
            </>
          )}
        </Typography>
      </Box>
    </StyledTransactionDetailsWrapper>
  );
};
