import React from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { Token } from '../../data/tokens/token.interface';
import { DropDownIcon } from '../Icons/DropDownIcon';
import { AllowanceStatus } from './AssetInput';
import { SButton } from './styled';
import { LockIcon } from 'components/Icons/LockIcon';

interface AssetSelectButtonProps {
  allowanceStatus: AllowanceStatus;
  token?: Token;
  onClick: () => void;
}

export const AssetSelectButton: React.FC<AssetSelectButtonProps> = ({ allowanceStatus, token, onClick }) => {
  return (
    <SButton variant="inputInner" onClick={() => onClick()}>
      {token && (
        <Box display={'flex'} alignItems={'center'} fontWeight={'inherit'}>
          <Image
            src={token.logoURI}
            loader={({ src }) => src}
            alt={'token logo'}
            width={20}
            height={20}
            style={{ marginRight: '5px', marginLeft: '5px' }}
            unoptimized
          />
          <Typography variant={'subtitle2'} width={'fit-content'} marginRight={'5px'}>
            {token.symbol}
          </Typography>
          {allowanceStatus === 'needed' && <LockIcon />}
          <DropDownIcon />
        </Box>
      )}
    </SButton>
  );
};
