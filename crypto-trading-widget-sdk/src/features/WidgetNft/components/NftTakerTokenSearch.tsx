import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import ButtonBase from '@mui/material/ButtonBase';
import { useDispatch } from 'react-redux';
import { Token } from 'data/tokens/token.interface';
import BigNumber from 'bignumber.js';
import { useTokenBalances } from '../../../hooks/useTokenBalances';
import { balancesObjectToArray, getTokenBalanceInfo } from '../../../utils/balancesObjectToArray';
import { EMPTY_ARRAY } from '../../../constants';
import { useTokenPrices } from '../../../hooks/useTokenPrices';
import { TokenImage } from '../../../components/TokenImage';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { NftWidgetScreen, setNftWidgetScreen, setTakerTokenAddress } from '../../../redux/nftWidgetSlice';
import { WalletCtx } from '../../../context/WalletContext';
import { Chain } from '../../../utils/chains';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  marginLeft: 0,
  width: '100%',
  svg: {
    fontSize: 24,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: 14,
  },
}));

export const NftTakerTokenSearch: React.FC<{ chain: Chain }> = ({ chain }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const ctx = useContext(WalletCtx);

  const { isLoading: balancesIsLoading, data: tokenBalances } = useTokenBalances(ctx?.account ?? '', chain);
  const tokenBalancesArray = balancesObjectToArray(tokenBalances);
  const { isLoading: pricesIsLoading, data: tokenPrices } = useTokenPrices(tokenBalancesArray, chain);

  const tokenListMap = useAppSelector(({ app }) => app.tokenListMap);

  const [filteredTokens, setFilteredTokens] = useState<Token[]>(EMPTY_ARRAY);
  const tokensIsLoading = ctx?.account && pricesIsLoading && balancesIsLoading;

  const tokens = useMemo(() => {
    const tokensMap = tokenListMap[chain].tokens;
    const tokensArray = [];

    for (const tokensKey in tokensMap) {
      const tokenBalanceInfo = getTokenBalanceInfo(tokenBalances, tokenPrices, tokensKey);
      const balance = tokenBalanceInfo.balance;
      const usdBalance = tokenBalanceInfo.usdBalance;
      const precision = tokenBalanceInfo.precision;

      tokensArray.push({ ...tokensMap[tokensKey], balance, usdBalance, precision });
    }
    if (tokenPrices) {
      tokensArray.sort((token, token2) => {
        if (token2.usdBalance) {
          return token2.usdBalance.minus(token.usdBalance ?? BigNumber(0)).toNumber();
        } else {
          return -1;
        }
      });
    }

    if (!tokenPrices && tokenBalances) {
      tokensArray.sort((token, token2) => {
        if (token2.balance) {
          return token2.balance.minus(token.usdBalance ?? BigNumber(0)).toNumber();
        } else {
          return -1;
        }
      });
    }
    setFilteredTokens(tokensArray);
    return tokensArray;
  }, [tokenBalances, tokenPrices]);

  useEffect(() => {
    document.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(setNftWidgetScreen(NftWidgetScreen.DEFAULT));
      }
    };
    return () => {
      document.onkeydown = null;
    };
  }, []);

  const searchOnChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const res = tokens.filter(token => token.symbol.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredTokens(res);
  };

  const selectToken = (token: Token) => {
    dispatch(setTakerTokenAddress(token.address));
    dispatch(setNftWidgetScreen(NftWidgetScreen.DEFAULT));
  };

  const buttonStyle = {
    width: '100%',
    height: '48px',
    padding: 0.5,
    paddingRight: 1,
    justifyContent: 'left',
    '&.MuiButtonBase-root': {
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  };
  return (
    <>
      <Box sx={{ height: '100%', paddingBottom: 2, overflow: 'hidden' }}>
        <Search
          style={{
            marginBottom: 10,
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search by token name..."
            inputProps={{ 'aria-label': 'search' }}
            onChange={searchOnChange}
          />
        </Search>
        <Box sx={{ height: '100%', overflow: 'scroll' }}>
          <Grid container spacing={1}>
            {tokensIsLoading &&
              Array.from(Array(5).keys()).map(elem => (
                <Grid item key={'skeleton' + elem} xs={12}>
                  <Skeleton variant={'rectangular'} height={40} />
                </Grid>
              ))}

            {!tokensIsLoading &&
              filteredTokens.map(token => (
                <Grid item key={token.address} xs={12}>
                  <ButtonBase sx={buttonStyle} focusRipple={true} onClick={() => selectToken(token)}>
                    <TokenImage
                      src={token.logoURI}
                      style={{ width: 28, height: 28, marginRight: 8 }}
                      alt={'Token icon'}
                    />
                    <Box>
                      <Typography variant="subtitle1" width="fit-content">
                        {token.symbol}
                      </Typography>
                      {(token.balance ?? 0) > 0 && (
                        <Typography variant="body1" width="fit-content">
                          {String(token.balance?.toFixed(token.precision ?? 5))}
                          {token.usdBalance && ` ($${token.usdBalance?.toFixed(2)})`}
                        </Typography>
                      )}
                    </Box>
                  </ButtonBase>
                </Grid>
              ))}
          </Grid>
          <div style={{ height: 80 }} />
        </Box>
      </Box>
    </>
  );
};
