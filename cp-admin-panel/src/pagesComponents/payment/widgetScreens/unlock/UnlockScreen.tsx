import { Box, IconButton, styled, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { DefaultButton } from 'src/@core/components/buttons/DefaultButton';
import Icon from 'src/@core/components/icon';
import { usePaymentPrice } from 'src/hooks/usePayment';
import { useRequestApprove } from 'src/hooks/useRequestApprove';
import { useAppDispatch, useAppSelector } from 'src/store/hooks/reduxHooks';
import { setPaymentScreen, PaymentScreen } from 'src/store/payment/slice';

const StyledTokenIcon = styled('img', {
  name: 'StyledTokenIcon'
})(({ theme }) => ({
  width: 80,
  height: 80,
  marginBottom: theme.spacing(6)
}));

export const UnlockScreen = () => {
  const { selectedToken, selectedChainId } = useAppSelector(({ payment }) => payment);
  const { mutate: requestApproveMutate } = useRequestApprove(selectedChainId, selectedToken.address);
  const { data: orderPrice } = usePaymentPrice();
  const dispatch = useAppDispatch();

  const onBackClick = () => {
    dispatch(setPaymentScreen(PaymentScreen.DEFAULT));
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      position={'relative'}
      flexGrow={1}
    >
      <Box mr={'auto'} onClick={onBackClick} position={'absolute'} top={'0'} left={'0'}>
        <IconButton aria-label='delete' size='small'>
          <Icon icon='mdi:chevron-left' fontSize='2rem' />
        </IconButton>
      </Box>
      <StyledTokenIcon src={selectedToken.logoURI} />
      <Typography variant={'h4'} mb={4}>
        {'Unlock token'}
      </Typography>
      <Typography variant={'body2'} textAlign={'center'} color={'text.secondary'} mb={10}>
        {`Your smart contract needs your permissions in order to move ${selectedToken.symbol} on your behalf.`}
      </Typography>
      <Box display={'flex'} flexDirection={'column'} gap={2} width={'100%'}>
        <DefaultButton onClick={() => requestApproveMutate(orderPrice?.payInAmount)}>
          {`Unlock `}
          <NumericFormat
            value={orderPrice?.payInHumanAmount}
            displayType={'text'}
            thousandSeparator={true}
            decimalScale={4}
          />
          {` ${selectedToken.symbol}`}
        </DefaultButton>
        {/**
         * conflict with types so need to pass undefined
         * @todo: fix types
         */}
        <DefaultButton onClick={() => requestApproveMutate(undefined)}>{'Unlock permanently'}</DefaultButton>
      </Box>
    </Box>
  );
};
