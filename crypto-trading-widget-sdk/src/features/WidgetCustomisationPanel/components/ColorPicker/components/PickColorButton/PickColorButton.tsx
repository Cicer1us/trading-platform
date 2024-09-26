import { ButtonBase } from '@mui/material';
import React from 'react';
import { Box, BoxProps, styled } from '@mui/material';

interface SBoxProps extends BoxProps {
  backgroundColor: string;
}

interface PickColorButtonProps {
  backgroundColor: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const SBox = styled(({ ...props }: SBoxProps) => <Box {...props} />, {
  name: 'SBox',
})(({ backgroundColor }) => ({
  backgroundColor: backgroundColor,
  width: 66,
  height: 32,
  border: '1px solid #C5C9C9',
  borderRadius: 8,
}));

export const PickColorButton: React.FC<PickColorButtonProps> = ({ backgroundColor, onClick }) => {
  return (
    <ButtonBase onClick={onClick}>
      <SBox backgroundColor={backgroundColor} />
    </ButtonBase>
  );
};
