import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import { NumberFormatCustom } from './NumberFormatCustom';
import { ErrorIcon } from '../Icons/ErrorIcon';
import { AssetSelectButton } from './AssetSelectButton';
import { CircularProgressCustom } from './CircularPogressCustom';
import { Token } from '../../data/tokens/token.interface';
import { NO_TOKEN_IMAGE_URL } from '../../constants';
import { SOutlinedInput, SDiv, SMaxButton, SFormHelperText } from './styled';

export interface AssetInputError {
  message: string;
  severity: 'error' | 'warning';
}

export type AllowanceStatus = 'loading' | 'needed' | undefined;

interface TokenInputProps {
  amount: string;
  loading: boolean;
  maxButton?: boolean;
  search?: boolean;
  token?: Token;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onTokenSelectClick: () => void;
  error?: AssetInputError;
  allowanceStatus?: AllowanceStatus;
  maxButtonOnClick?: () => void;
}

export const AssetInput: React.FC<TokenInputProps> = ({
  amount,
  loading,
  search,
  maxButton,
  allowanceStatus,
  token,
  onChange,
  onTokenSelectClick,
  error,
  maxButtonOnClick,
}) => {
  return (
    <Box>
      <SOutlinedInput
        onChange={onChange}
        value={amount}
        error={error && error?.severity === 'error'}
        disabled={loading}
        fullWidth={true}
        inputComponent={loading ? CircularProgressCustom : (NumberFormatCustom as never)}
        inputMode={'numeric'}
        endAdornment={
          <>
            {maxButton && (
              <SMaxButton variant="inputInner" onClick={maxButtonOnClick}>
                {'MAX'}
              </SMaxButton>
            )}
            {search && (
              <AssetSelectButton allowanceStatus={allowanceStatus} token={token} onClick={onTokenSelectClick} />
            )}
            {!search && (
              <SDiv>
                <Image
                  src={token?.logoURI || NO_TOKEN_IMAGE_URL}
                  alt={'token logo'}
                  loader={({ src }) => src}
                  width={20}
                  height={20}
                  style={{ marginRight: 7 }}
                  unoptimized
                />
                {token?.symbol}
              </SDiv>
            )}
          </>
        }
      />
      <SFormHelperText error assetInputError={error}>
        {error && <ErrorIcon />}
        {error?.message}
      </SFormHelperText>
    </Box>
  );
};
