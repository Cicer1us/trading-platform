import * as React from 'react';
import Tab from '@mui/material/Tab';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks/reduxHooks';
import { setCurrentSettingsTab, SettingTab, WidgetType } from '../../../../redux/customisationSlice';
import { SPaper, STabs } from './styled';

export const SettingsTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector(({ customisation }) => customisation.currentSettingsTab);
  const widgetType = useAppSelector(({ customisation }) => customisation.options.widgetType);

  const onChangeHandler = (e: React.SyntheticEvent, value: SettingTab) => {
    dispatch(setCurrentSettingsTab(value));
  };

  return (
    <SPaper>
      <STabs
        value={currentTab}
        onChange={onChangeHandler}
        aria-label="option tabs"
        variant="scrollable"
        scrollButtons={false}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
      >
        <Tab label="Widget" />
        <Tab label="Notifications" />
        {widgetType !== WidgetType.NFT && <Tab label="Chains &amp; Tokens" />}
        {widgetType === WidgetType.NFT && <Tab label="Listing" />}
      </STabs>
    </SPaper>
  );
};
