import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { Clarification } from '../../../components/Clarification/Clarification';
import React from 'react';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';

export const TransactionInfo: React.FC = () => {
  const theme = useTheme();

  const priceRoute = useAppSelector(({ app }) => app.priceRoute);
  const youReceive = useAppSelector(({ app }) => app.youReceive);

  /**
   * TODO: Add real calculations for transaction cost
   */

  const txFee = priceRoute ? Number(priceRoute.gasCostUSD).toFixed(2) : 0;
  const totalCost = priceRoute
    ? Number(Number(priceRoute.gasCostUSD) + Number(priceRoute.srcUSD) * 1.002).toFixed(2)
    : 0;

  return (
    <Box>
      <Box marginBottom={1} marginTop={1}>
        <Clarification
          title={'Estimated costs'}
          variant={'subtitle1'}
          description={'Transactions costs estimates, accurate costs will be calculated after confirming transaction'}
        />
      </Box>
      <Box marginBottom={1} display={'flex'} justifyContent={'space-between'}>
        <Clarification
          title="Transaction Fee"
          description={'Gas fees + platform fees in USD equivalent, paid by user to perform the transaction'}
          color={theme.palette.text.secondary}
        />
        {youReceive.loading ? (
          <Skeleton variant="rectangular" width={70} height={21} />
        ) : (
          <Typography variant={'subtitle1'}>{`${txFee} USD`}</Typography>
        )}
      </Box>
      <Box marginBottom={1} display={'flex'} justifyContent={'space-between'}>
        <Clarification
          title="Total Transaction Cost"
          description={"Total value in USD equivalent you'll pay for the token"}
          color={theme.palette.text.secondary}
        />
        {youReceive.loading ? (
          <Skeleton variant="rectangular" width={70} height={21} />
        ) : (
          <Typography variant={'subtitle1'}>{`${totalCost} USD`}</Typography>
        )}
      </Box>
    </Box>
  );
};
