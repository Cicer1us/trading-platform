import { ButtonBase, styled } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { SNftWidgetCard } from 'features/WidgetNft/styled';

export const SCard = SNftWidgetCard;

export const SButtonBase = styled(ButtonBase, {
  name: 'SButtonBase',
})(({ theme }) => ({
  height: 24,
  marginRight: theme.spacing(1),
}));

export const SPoweredByContainer = styled('div', {
  name: 'SPoweredByContainer',
})({
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, 0)',
  bottom: 5,
});
export const SArrowBackIosNewIcon = styled(ArrowBackIosNewIcon, {
  name: 'SArrowBackIosNewIcon',
})(({ theme }) => ({
  fill: theme.palette.text.secondary,
  fontSize: '20px',
}));
