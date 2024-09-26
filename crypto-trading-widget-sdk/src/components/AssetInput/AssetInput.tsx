import React from 'react';
import Box from '@mui/material/Box';
import { NumberFormatCustom } from './NumberFormatCustom';
import { ErrorIcon } from '../Icons/ErrorIcon';
import { AssetSelectButton } from './AssetSelectButton';
import { CircularProgressCustom } from './CircularPogressCustom';
import { InputOptions, WidgetScreen } from '../../redux/app.interface';
import { Token } from '../../data/tokens/token.interface';
import { TokenImage } from '../TokenImage';
import { SAssetOutlinedInput, SMaxButton, STokenImageWrapper, SFormHelperText } from './styled';

export interface AssetInputError {
  message: string;
  severity: 'error' | 'warning';
}

export type AllowanceStatus = 'loading' | 'needed' | undefined;

interface TokenInputProps {
  inputState: InputOptions;
  token: Token;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  search?: WidgetScreen.SearchPayToken | WidgetScreen.SearchReceiveToken;
  error?: AssetInputError;
  allowanceStatus?: AllowanceStatus;
  maxButtonOnClick?: () => void;
}

export const AssetInput: React.FC<TokenInputProps> = ({
  inputState,
  allowanceStatus,
  token,
  onChange,
  error,
  search,
  maxButtonOnClick,
}) => {
  return (
    <Box>
      <SAssetOutlinedInput
        onChange={onChange}
        value={inputState.amount}
        error={error && error?.severity === 'error'}
        disabled={inputState.loading}
        fullWidth={true}
        inputComponent={inputState.loading ? CircularProgressCustom : (NumberFormatCustom as never)}
        inputMode={'numeric'}
        endAdornment={
          <Box display={'flex'} alignItems={'center'} gap={1}>
            {inputState.maxButton === true && (
              <SMaxButton variant="inputInner" onClick={maxButtonOnClick}>
                {'MAX'}
              </SMaxButton>
            )}
            {!inputState.locked && search && (
              <AssetSelectButton allowanceStatus={allowanceStatus} search={search} token={token} />
            )}
            {inputState.locked && (
              <STokenImageWrapper>
                <TokenImage
                  src={token.logoURI}
                  alt={'token logo'}
                  style={{ width: '20px', height: '20px', marginRight: 7 }}
                />
                {token.symbol}
              </STokenImageWrapper>
            )}
          </Box>
        }
      />
      <SFormHelperText error errorObject={error}>
        {error && <ErrorIcon />}
        {error?.message}
      </SFormHelperText>
    </Box>
  );
};
