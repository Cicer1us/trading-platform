import { Button, FormHelperText, FormHelperTextProps, OutlinedInput, styled } from '@mui/material';
import { inputInnerButtonHeight } from '../../theme/components/constants';
import { AssetInputError } from './AssetInput';

interface SFormHelperTextProps extends FormHelperTextProps {
  assetInputError?: AssetInputError;
}
export const SButton = styled(Button)(({ theme }) => ({
  marginLeft: 0.5,
  color: theme.palette.text?.secondaryButton,
  stroke: theme.palette.text?.secondaryButton,
  backgroundColor: theme.palette.secondaryButton.main,
  '&:hover': {
    backgroundColor: theme.palette.secondaryButton.main,
    opacity: 0.8,
  },
  height: inputInnerButtonHeight,
  padding: '0 8px',
  borderRadius: theme.spacing(1),
  alignItems: 'center',
  minWidth: 'fit-content',
}));

export const SOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  fontSize: 14,
  backgroundColor: theme.palette.secondary.main,
  '& input': { maxHeight: '-webkit-fill-available' },
}));

export const SDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  fontWeight: 700,
  fontSize: 16,
  lineHeight: '23px',
  color: theme.palette.text.primary,
  marginLeft: theme.spacing(0.5),
}));

export const SMaxButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text?.secondaryButton,
  backgroundColor: theme.palette.secondaryButton.main,
  '&:hover': {
    backgroundColor: theme.palette.secondaryButton.main,
    opacity: 0.8,
  },
  opacity: 1,
  marginRight: theme.spacing(1),
}));

export const SFormHelperText = styled(({ assetInputError, ...props }: SFormHelperTextProps) => (
  <FormHelperText {...props} />
))(({ theme, assetInputError }) => ({
  display: 'flex',
  height: '20px',
  stroke: assetInputError?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light,
  color: assetInputError?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light,
}));
