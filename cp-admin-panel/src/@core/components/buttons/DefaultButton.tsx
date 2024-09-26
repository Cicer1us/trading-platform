import { Button, ButtonProps, styled } from '@mui/material';

const StyledDefaultButton = styled(Button, {
  name: 'StyledDefaultButton'
})(({ theme }) => ({
  width: '100%',
  fontSize: '1rem',
  height: 48,
  fontWeight: 700,
  textTransform: 'none',
  whiteSpace: 'pre',
  backgroundColor: theme.palette.success.main,
  '&:hover': { backgroundColor: theme.palette.divider }
}));

export const DefaultButton: React.FC<ButtonProps> = props => {
  return (
    <StyledDefaultButton variant={'contained'} {...props}>
      {props.children}
    </StyledDefaultButton>
  );
};
