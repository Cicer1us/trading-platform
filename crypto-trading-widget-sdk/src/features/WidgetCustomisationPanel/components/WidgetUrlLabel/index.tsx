import React from 'react';
import Fade from '@mui/material/Fade';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { SPaper } from './styled';

interface WidgetUrlLabelProps {
  widgetUrl: string;
}

export const WidgetUrlLabel: React.FC<WidgetUrlLabelProps> = ({ widgetUrl }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();

  const handleClick = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLDivElement>) => {
    navigator.clipboard.writeText(widgetUrl).then(() => {
      setTimeout(() => setOpen(false), 800);
    });
    setAnchorEl(event.currentTarget);
    setOpen(prev => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  return (
    <Card onClick={handleClick('top')}>
      <Typography variant={'body1'} noWrap color={theme => theme.palette.text?.secondary}>
        {widgetUrl}
      </Typography>
      <div style={{ flexGrow: 1 }} /> {/* TODO: find out if it is necessary*/}
      <ContentCopyIcon />
      <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <SPaper variant={'tooltip'}>
              <Typography padding={2}>{'Copied!'}</Typography>
            </SPaper>
          </Fade>
        )}
      </Popper>
    </Card>
  );
};
