import Box from '@mui/material/Box';
import React from 'react';
import { ContainedButton } from '../../../components/Buttons/ContainedButton';
import { styled } from '@mui/material';

interface StickyButtonProps {
  onClick: () => void;
}

const SBox = styled(Box, {
  name: 'SBox',
})(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  paddingLeft: 2,
  paddingTop: 1,
  paddingRight: 2,
  paddingBottom: 1,
  zIndex: 2,
}));

export const StickyButton: React.FC<StickyButtonProps> = ({ onClick }) => {
  return (
    <SBox>
      <ContainedButton onClick={onClick} fullWidth>
        {'Check widget'}
      </ContainedButton>
    </SBox>
  );
};
