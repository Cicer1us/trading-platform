import React from 'react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Clarification, CustomTooltip } from '../../../components/Clarification/Clarification';
import { CreateTransactionButton } from '../components/Buttons/CreateTransactionButton';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { FEE } from '../../../constants';
import { chainConfigs } from '../../../utils/chains';
import { formatEther, formatUnits } from '@ethersproject/units';
import NumberFormat from 'react-number-format';

export const TransactionDetails = () => {
  const theme = useTheme();
  const youPayToken = useAppSelector(({ app }) => {
    const tokens = app.tokenListMap[app.selectedChain].tokens;
    return tokens[app.tokenListMap[app.selectedChain].youPayToken];
  });
  const youReceiveToken = useAppSelector(({ app }) => {
    const tokens = app.tokenListMap[app.selectedChain].tokens;
    return tokens[app.tokenListMap[app.selectedChain].youReceiveToken];
  });
  const selectedChain = useAppSelector(({ app }) => app.selectedChain);
  const priceRoute = useAppSelector(({ app }) => app.priceRoute);

  if (!priceRoute) {
    return <></>;
  }

  const youPayAmount = formatUnits(priceRoute.srcAmount, priceRoute.srcDecimals);
  const serviceFee = (Number(youPayAmount) * (Number(FEE) / 1000)).toFixed(6);

  const fields = [
    {
      title: 'You pay',
      description: 'Amount in tokens you will spend to receive token',
      tooltip: (
        <>
          {parseFloat(youPayAmount).toString()} {youPayToken.symbol}
        </>
      ),
      content: (
        <NumberFormat
          value={parseFloat(youPayAmount).toString()}
          displayType={'text'}
          decimalScale={4}
          suffix={` ${youPayToken.symbol}`}
        />
      ),
    },
    {
      title: 'Gas fees',
      description: 'Fees to cover Network transaction costs',
      tooltip: (
        <>
          {formatEther(priceRoute.gasCost ?? '0')} {chainConfigs[selectedChain].nativeToken.symbol}
        </>
      ),
      content: (
        <NumberFormat
          prefix="~"
          value={formatEther(priceRoute.gasCost ?? '0')}
          displayType={'text'}
          decimalScale={4}
          suffix={` ${chainConfigs[selectedChain].nativeToken.symbol}`}
        />
      ),
    },
    {
      title: 'Service fees',
      description: 'Fees the platform earns to perform the transaction',
      tooltip: (
        <>
          {serviceFee} {youPayToken.symbol}
        </>
      ),
      content: (
        <NumberFormat
          prefix="~"
          value={serviceFee}
          displayType={'text'}
          decimalScale={4}
          suffix={` ${youPayToken.symbol}`}
        />
      ),
    },
    {
      title: 'You receive',
      description: "Amount of token you'll receive",
      tooltip: (
        <>
          {parseFloat(formatUnits(priceRoute.destAmount, priceRoute.destDecimals)).toString()} {youReceiveToken.symbol}
        </>
      ),
      // TODO: Add calculation using usd price?
      content: (
        <NumberFormat
          value={parseFloat(formatUnits(priceRoute.destAmount, priceRoute.destDecimals)).toString()}
          displayType={'text'}
          decimalScale={4}
          suffix={` ${youReceiveToken.symbol}`}
        />
      ),
    },
  ];

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems="start" height={'100%'}>
      {fields.map(field => (
        <Box marginBottom={1.5} display={'flex'} justifyContent={'space-between'} width={'100%'} key={field.title}>
          <Clarification title={field.title} description={field.description} color={theme.palette.text.secondary} />

          <CustomTooltip title={field.tooltip} placement={'top'} arrow>
            <Typography variant={'subtitle1'}>{field.content}</Typography>
          </CustomTooltip>
        </Box>
      ))}

      <Box flexGrow={1} />
      <CreateTransactionButton />
    </Box>
  );
};
