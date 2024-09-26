import { Button, ButtonProps, styled } from '@mui/material';

const StyledPrimaryButton = styled(Button, {
  name: 'StyledPrimaryButton'
})(() => ({
  height: 38,
  maxWidth: 220
}));

export const PrimaryButton: React.FC<ButtonProps> = props => {
  return (
    <StyledPrimaryButton variant={'contained'} {...props}>
      {props.children}
    </StyledPrimaryButton>
  );
};
