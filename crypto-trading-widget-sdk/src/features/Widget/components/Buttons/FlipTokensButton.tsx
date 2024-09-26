import Grid from '@mui/material/Grid';
import { SecondaryButton } from 'components/Buttons/SecondaryButton';
import { SwapIcon } from 'components/Icons/SwapIcon';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setSwitchInputs } from '../../../../redux/appSlice';
import { useCalculatePrice } from '../../Swap/useCalculatePrice';
import { useAppSelector } from '../../../../redux/hooks/reduxHooks';
import { WidgetType } from 'redux/customisationSlice';

export const FlipTokensButton: React.FC = () => {
  const dispatch = useDispatch();
  const youPay = useAppSelector(({ app }) => app.youPay);
  const youReceive = useAppSelector(({ app }) => app.youReceive);
  const { updatePriceRoute } = useCalculatePrice();
  const widgetType = useAppSelector(({ customisation }) => customisation.options.widgetType);

  const onClick = () => {
    if (!youPay.loading && !youReceive.loading) {
      dispatch(setSwitchInputs());
      updatePriceRoute();
    }
  };

  return (
    <Grid item xs={12} display="flex" justifyContent="center">
      <SecondaryButton children={<SwapIcon />} onClick={onClick} hidden={widgetType === WidgetType.SALE} />
    </Grid>
  );
};
