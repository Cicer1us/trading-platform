import React from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

const StyledSecondaryButton = styled(Button, {
  name: 'StyledSecondaryButton',
})(({ theme, hidden }) => ({
  visibility: hidden ? 'hidden' : 'visible',
  width: 40,
  height: 40,
  padding: 0.75,
  color: theme.palette.text.secondary,
  stroke: theme.palette.text.primary,
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    borderColor: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const SecondaryButton: React.FC<ButtonProps> = props => {
  return (
    <StyledSecondaryButton variant={'containedSecondary'} {...props}>
      {props.children}
    </StyledSecondaryButton>
  );
};
