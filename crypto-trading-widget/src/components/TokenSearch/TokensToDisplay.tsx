import { Grid, Box, Typography, Skeleton } from '@mui/material';
import { SBox, SButtonBase } from './styled';
import Image from 'next/image';
import { Token } from 'data/tokens/token.interface';

interface TokenToDisplayProps {
  tokensIsLoading: boolean;
  filteredTokens: Token[];
  onSelect: (token: Token) => void;
}

export const TokensToDisplay: React.FC<TokenToDisplayProps> = ({ tokensIsLoading, filteredTokens, onSelect }) => (
  <SBox>
    <Grid container spacing={1}>
      {!tokensIsLoading
        ? filteredTokens.map(token => (
            <Grid item key={token.address} xs={12}>
              <SButtonBase focusRipple={true} onClick={() => onSelect(token)}>
                <Image
                  src={token.logoURI}
                  loader={({ src }) => src}
                  alt={'token logo'}
                  width={28}
                  height={28}
                  style={{ marginRight: 8 }}
                  unoptimized
                />
                <Box>
                  <Typography variant="body1" fontWeight={700} width="fit-content">
                    {token.symbol}
                  </Typography>
                  {(token.balance ?? 0) > 0 && (
                    <Typography variant="body1" width="fit-content">
                      {String(token.balance?.toFixed(token.precision ?? 5))}
                      {token.usdBalance && ` ($${token.usdBalance?.toFixed(2)})`}
                    </Typography>
                  )}
                </Box>
              </SButtonBase>
            </Grid>
          ))
        : Array.from(Array(5).keys()).map(elem => (
            <Grid item key={'skeleton' + elem} xs={12}>
              <Skeleton variant={'rectangular'} height={40} />
            </Grid>
          ))}
    </Grid>
  </SBox>
);
