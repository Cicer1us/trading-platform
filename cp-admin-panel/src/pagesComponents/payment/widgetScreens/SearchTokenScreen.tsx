import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  debounce,
  FormControl,
  IconButton,
  Skeleton,
  styled,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTokensLists } from 'src/hooks/useTokenList';
import { useAppDispatch, useAppSelector } from 'src/store/hooks/reduxHooks';
import { StyledTokenImage } from '../SelectTokenButton';
import { PaymentScreen, setPaymentScreen, setSelectedToken } from 'src/store/payment/slice';
import { Token } from 'src/connection/types';
import { isNonEmptyArray } from 'src/common/helpers';
import { useTokensBalances } from 'src/hooks/useTokensBalances';
import { EMPTY_ARRAY } from 'src/common/constants';
import { NumericFormat } from 'react-number-format';
import Icon from 'src/@core/components/icon';

const StyledSearchTokenInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(6),
  '& .MuiOutlinedInput-root': {
    height: 44,
    borderRadius: theme.spacing(10)
  }
}));

const StyledTokensWrapper = styled(Box, {
  name: 'StyledTokensWrapper'
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: theme.spacing(2)
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: theme.shape.borderRadius
  }
}));

const StyledTokenButton = styled(Button, {
  name: 'StyledTokenButton'
})(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  gap: theme.spacing(2),
  textTransform: 'none',
  color: theme.palette.text.primary,
  padding: '4px 8px'
}));

const StyledLoaderShadow = styled(CircularProgress, {
  name: 'StyledLoaderShadow'
})(({ theme }) => ({
  color: theme.palette.success.light
}));

const StyledLoader = styled(CircularProgress, {
  name: 'StyledLoader'
})(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.success.main
}));

interface TokenWithBalance extends Token {
  balance?: number;
}

export const SearchTokenScreen = () => {
  const dispatch = useAppDispatch();
  const { selectedChainId } = useAppSelector(({ payment }) => payment);
  const { data: tokensList, isLoading: tokensListIsLoading } = useTokensLists();

  /**
   * @todo: make balances request under the hood (after wallet connect or chain switch)
   */
  const { data: tokensBalances, isFetching: tokensBalancesIsFetching } = useTokensBalances(selectedChainId);

  const [query, setQuery] = useState('');
  const tokensToDisplay: TokenWithBalance[] = useMemo(
    () =>
      tokensList?.[selectedChainId]
        ?.map(token => ({
          ...token,
          balance: Number(tokensBalances?.[token.address]?.humanAmount) ?? 0
        }))
        .sort((token1, token2) => token2.balance - token1.balance)
        .filter(token => token.symbol.toLowerCase().includes(query.trim())) ?? EMPTY_ARRAY,
    [tokensList, selectedChainId, tokensBalances, query]
  );

  const onChange = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase());
  }, 500);

  const onClick = (token: Token) => {
    dispatch(setSelectedToken(token));
    dispatch(setPaymentScreen(PaymentScreen.DEFAULT));
  };

  const onBackClick = () => {
    dispatch(setPaymentScreen(PaymentScreen.DEFAULT));
  };

  return (
    <>
      <Box mr={'auto'} onClick={onBackClick}>
        <IconButton aria-label='delete' size='small'>
          <Icon icon='mdi:chevron-left' fontSize='2rem' />
        </IconButton>
      </Box>
      <FormControl fullWidth>
        <StyledSearchTokenInput
          autoComplete='off'
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <Box display={'flex'} alignItems={'center'} mr={2}>
                <SearchIcon />
              </Box>
            )
          }}
          placeholder='Search...'
        />
      </FormControl>
      {isNonEmptyArray(tokensToDisplay) ? (
        <StyledTokensWrapper>
          {tokensToDisplay.map(token => (
            <StyledTokenButton key={token.address} onClick={() => onClick(token)}>
              <StyledTokenImage src={token.logoURI} alt={token.symbol} />
              <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
                <Typography variant='body2' color='text.primary' fontWeight={700}>
                  {token.symbol}
                </Typography>
                <Typography variant='body2'>
                  {tokensBalancesIsFetching ? (
                    <Skeleton width={'160px'} />
                  ) : (
                    <NumericFormat
                      value={token.balance}
                      displayType={'text'}
                      thousandSeparator={true}
                      decimalScale={4}
                    />
                  )}
                </Typography>
              </Box>
            </StyledTokenButton>
          ))}
        </StyledTokensWrapper>
      ) : (
        <>
          {tokensListIsLoading ? (
            <Box position={'relative'} display={'flex'} alignItems={'center'} justifyContent={'center'} flexGrow={1}>
              <StyledLoaderShadow variant='determinate' size={60} thickness={4} value={100} />
              <StyledLoader size={60} thickness={6} />
            </Box>
          ) : (
            <Box display={'flex'} flexDirection={'column'} justifyContent={'start'} alignItems={'center'}>
              <Typography variant='body1'>{`Sorry, we can't find the token.`}</Typography>
              <Typography variant='body1'>{`Please, try again`}</Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};
