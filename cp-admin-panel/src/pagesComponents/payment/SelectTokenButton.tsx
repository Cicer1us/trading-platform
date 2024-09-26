import { Box, Button, Typography, styled, ButtonProps } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/store/hooks/reduxHooks';
import { PaymentScreen, setPaymentScreen } from 'src/store/payment/slice';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Image from 'next/image';
import { usePaymentCondition } from 'src/hooks/usePaymentCondition';

interface StyledSelectTokenButtonProps extends ButtonProps {
  isWarning: boolean;
}

const StyledSelectTokenButton = styled(({ ...props }: StyledSelectTokenButtonProps) => <Button {...props} />, {
  name: 'StyledSelectTokenButton',
  shouldForwardProp: prop => prop !== 'isWarning'
})(({ theme, isWarning }) => ({
  position: 'relative',
  width: '100%',
  textTransform: 'none',
  paddingRight: theme.spacing(1.5),
  color: theme.palette.text.primary,
  borderColor: isWarning ? theme.palette.warning.main : theme.palette.grey[300],
  backgroundColor: 'transparent !important',
  '&:hover': {
    borderColor: theme.palette.grey[400]
  }
}));

export const StyledTokenImage = styled('img', {
  name: 'StyledTokenImage'
})(() => ({
  width: 20,
  height: 20
}));

export const SelectTokenButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedToken } = useAppSelector(({ payment }) => payment);
  const { isInsufficientAllowance, isInsufficientBalance } = usePaymentCondition();

  const onClick = () => {
    dispatch(setPaymentScreen(PaymentScreen.SEARCH_TOKEN));
  };

  return (
    <>
      <StyledSelectTokenButton
        isWarning={isInsufficientAllowance || isInsufficientBalance}
        variant='outlined'
        onClick={onClick}
      >
        <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
          {/* {isLoading ? (
            <Skeleton width={'50%'} />
          ) : ( */}
          <Box display={'flex'} alignItems={'center'} gap={2}>
            <StyledTokenImage src={selectedToken?.logoURI} alt={selectedToken?.symbol} />
            <Typography>{selectedToken?.symbol}</Typography>
            {isInsufficientAllowance && (
              <Image src={'/images/locked.svg'} width={16} height={16} alt={'locked'} priority />
            )}
          </Box>
          {/* )} */}
          <ArrowDropDownIcon color='action' />
        </Box>
        <Typography variant='subtitle2' color={'warning.main'} position={'absolute'} top={56} left={8}>
          {isInsufficientBalance && 'Insufficient balance'}
        </Typography>
      </StyledSelectTokenButton>
    </>
  );
};
