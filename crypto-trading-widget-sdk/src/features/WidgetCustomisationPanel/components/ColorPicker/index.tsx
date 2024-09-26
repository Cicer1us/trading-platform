import React, { useEffect } from 'react';
import Fade from '@mui/material/Fade';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ChromePicker } from 'react-color';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks/reduxHooks';
import { changeWidgetOptions } from '../../../../redux/customisationSlice';
import { ColorParam } from '../../constants';
import { palette } from '../../../../theme/palette';
import { SPaper } from './styled';
import { PickColorButton } from './components/PickColorButton/PickColorButton';

export enum ColorKey {
  Primary = 'primary',
  Secondary = 'secondary',
  PaperBackground = 'paper',
  TextPrimary = 'text-primary',
  TextSecondary = 'text-secondary',
  TextPrimaryButton = 'text-primaryButton',
  TextSecondaryButton = 'text-secondaryButton',
  SecondaryButton = 'secondaryButton',
  PaperSecondaryBackground = 'paperSecondaryBackground',
  Success = 'success',
  Error = 'error',
  Pending = 'warning',
}

interface ColorPickerProps {
  color: ColorParam;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const paletteOverrides = useAppSelector(({ customisation }) => customisation.options.paletteOverrides);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const colorValue = paletteOverrides[color.key] ?? palette[color.key].main;

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleClick = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(prev => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  useEffect(() => {
    document.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    return () => {
      document.onkeydown = null;
    };
  });

  const dispatch = useAppDispatch();
  const change = (value: string) => {
    dispatch(changeWidgetOptions({ paletteOverrides: { ...paletteOverrides, [color.key]: value } }));
  };

  return (
    <Grid item xs={12} sm={6}>
      <Typography variant={'subtitle1'} marginBottom={1} marginTop={1}>
        {color.name}
      </Typography>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box>
          <SPaper elevation={0}>
            <Typography variant={'body1'} fontWeight={700}>
              {colorValue?.toUpperCase()}
            </Typography>
            <PickColorButton onClick={handleClick('top-start')} backgroundColor={colorValue} />
          </SPaper>
          <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <ChromePicker disableAlpha={true} color={colorValue} onChange={newColor => change(newColor.hex)} />
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
      </ClickAwayListener>
    </Grid>
  );
};
