import React from 'react';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import { RadioFormControlLabel } from '../../../components/RadioFormControlLabel';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks/reduxHooks';
import { setCurrentSettingsTab, SettingTab, setWidgetType, WidgetType } from '../../../redux/customisationSlice';
import { resetState } from 'redux/appSlice';

export const WidgetVariantSelection: React.FC = () => {
  const dispatch = useAppDispatch();
  const widgetType = useAppSelector(({ customisation }) => customisation.options.widgetType);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const variant = (event.target as HTMLInputElement).value as WidgetType;

    if (variant === WidgetType.NFT) {
      dispatch(setCurrentSettingsTab(SettingTab.WIDGET));
    }

    dispatch(setWidgetType(variant));

    /**
     * Resetting the state to default values
     * when the user changes the widget type
     * to avoid any conflicts with selected tokens
     */

    dispatch(resetState());
  };

  return (
    <FormControl>
      <RadioGroup row value={widgetType} name="radio-buttons-group" onChange={handleChange}>
        <RadioFormControlLabel value={WidgetType.NFT} label="NFT" />
        <RadioFormControlLabel value={WidgetType.SALE} label="Sale" />
        <RadioFormControlLabel value={WidgetType.SWAP} label="Swap" />
      </RadioGroup>
    </FormControl>
  );
};
