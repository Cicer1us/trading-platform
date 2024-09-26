import { Paper, Box, Typography, styled, Skeleton } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { usePayment, usePaymentPrice } from 'src/hooks/usePayment';
import { useAppSelector } from 'src/store/hooks/reduxHooks';
import { NumericFormat } from 'react-number-format';

const StyledOrderPriceWrapper = styled(Paper, {
  name: 'StyledOrderPriceWrapper'
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
  width: '100%',
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
  padding: theme.spacing(5)
}));

const StyledIconWrapper = styled(Box, {
  name: 'StyledIconWrapper'
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'max-content',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  color: theme.palette.success.main,
  backgroundColor: theme.palette.success.light
}));

export const StyledTokenImage = styled('img', {
  name: 'StyledTokenImage'
})(() => ({
  width: 24,
  height: 24
}));

interface OrderPriceProps {
  title: string;
  isTokenPrice?: boolean;
}

export const OrderPrice: React.FC<OrderPriceProps> = ({ title, isTokenPrice }) => {
  const { selectedToken } = useAppSelector(({ payment }) => payment);
  const { data: order } = usePayment();
  const { data: orderPrice, isLoading: orderPriceIsLoading } = usePaymentPrice();

  return (
    <StyledOrderPriceWrapper>
      <StyledIconWrapper>
        {isTokenPrice ? <StyledTokenImage src={selectedToken.logoURI} /> : <AccountBalanceWalletIcon />}
      </StyledIconWrapper>
      <Box width={'100%'}>
        {isTokenPrice ? (
          <Typography variant='h6' display={'flex'} gap={2}>
            {orderPriceIsLoading ? (
              <Skeleton width={'40%'} />
            ) : (
              <>
                <NumericFormat value={orderPrice?.payInHumanAmount} displayType={'text'} decimalScale={4} />{' '}
                {selectedToken.symbol}
              </>
            )}
          </Typography>
        ) : (
          <Typography variant='h6'>{`${order?.price.fiatPrice} ${order?.price.fiatCurrency.toUpperCase()}`}</Typography>
        )}
        <Typography variant='subtitle2' fontSize={12}>
          {title}
        </Typography>
      </Box>
    </StyledOrderPriceWrapper>
  );
};
