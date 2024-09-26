import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import { setSwapWidgetToken, setSaleWidgetToken, setCurrentScreen } from '../../../redux/appSlice';
import { Token } from 'data/tokens/token.interface';
import { useCalculatePrice } from '../Swap/useCalculatePrice';
import { WidgetScreen } from '../../../redux/app.interface';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { TokenImage } from '../../../components/TokenImage';
import { useTokenPrices } from '../../../hooks/useTokenPrices';
import { EMPTY_ARRAY } from '../../../constants';
import { WalletCtx } from '../../../context/WalletContext';
import { useTokenBalances } from '../../../hooks/useTokenBalances';
import BigNumber from 'bignumber.js';
import { balancesObjectToArray, getTokenBalanceInfo } from '../../../utils/balancesObjectToArray';
import {
  StyledBox,
  SSearchInputWrapper,
  SearchIconWrapper,
  StyledInputBase,
  SSelectTokenButton,
  SNoTokensTypography,
} from './styled';
import { WidgetType } from 'redux/customisationSlice';

export const TokenSearch: React.FC = () => {
  const dispatch = useDispatch();
  const ctx = useContext(WalletCtx);
  const chain = useAppSelector(({ app }) => app.selectedChain);

  const { isLoading: balancesIsLoading, data: tokenBalances } = useTokenBalances(ctx?.account ?? '', chain);
  const tokenBalancesArray = balancesObjectToArray(tokenBalances);
  const { isLoading: pricesIsLoading, data: tokenPrices } = useTokenPrices(tokenBalancesArray, chain);

  const tokenListMap = useAppSelector(({ app }) => app.tokenListMap);
  const widgetType = useAppSelector(({ customisation }) => customisation.options.widgetType);

  const [filteredTokens, setFilteredTokens] = useState<Token[]>(EMPTY_ARRAY);
  const { updatePriceRoute } = useCalculatePrice();
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
    setFilteredTokens(tokensArray as Token[]);
    return tokensArray;
  }, [tokenBalances, tokenPrices]);

  useEffect(() => {
    document.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(setCurrentScreen(WidgetScreen.Default));
      }
    };
    return () => {
      document.onkeydown = null;
    };
  }, []);

  const searchOnChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const res = tokens.filter(token => token.symbol?.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredTokens(res as Token[]);
  };

  const selectToken = (token: Token) => {
    if (widgetType === WidgetType.SWAP) dispatch(setSwapWidgetToken(token));

    if (widgetType === WidgetType.SALE) dispatch(setSaleWidgetToken(token));

    updatePriceRoute();
  };

  return (
    <>
      <Box pb={2} overflow={'hidden'} height={'100%'}>
        <SSearchInputWrapper>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search by token name..."
            inputProps={{ 'aria-label': 'search' }}
            onChange={searchOnChange}
          />
        </SSearchInputWrapper>
        <StyledBox>
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
                  <SSelectTokenButton focusRipple={true} onClick={() => selectToken(token)}>
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
                  </SSelectTokenButton>
                </Grid>
              ))}
          </Grid>
          {!filteredTokens.length && !tokensIsLoading && (
            <SNoTokensTypography
              variant="subtitle1"
              color={'text.secondary'}
            >{`Sorry, we can't find your token`}</SNoTokensTypography>
          )}
        </StyledBox>
      </Box>
    </>
  );
};
