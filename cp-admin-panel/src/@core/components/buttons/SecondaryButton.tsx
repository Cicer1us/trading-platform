import { Button, ButtonProps, styled } from '@mui/material';

const StyledSecondaryButton = styled(Button, {
  name: 'StyledSecondaryButton'
})(({ theme }) => ({
  height: 38,
  maxWidth: 220,
  backgroundColor: theme.palette.secondary.main
}));

export const SecondaryButton: React.FC<ButtonProps> = props => {
  return (
    <StyledSecondaryButton variant={'contained'} {...props}>
      {props.children}
    </StyledSecondaryButton>
  );
};
