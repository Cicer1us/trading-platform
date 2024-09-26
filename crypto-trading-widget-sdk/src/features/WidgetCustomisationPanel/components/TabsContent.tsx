import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { nftWidgetColors, notificationColors, widgetColors } from '../constants';
import { ColorPicker } from './ColorPicker';
import { ChainsSelection } from './ChainsSelection';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { SettingTab, WidgetType } from '../../../redux/customisationSlice';
import { ListingOrders } from './ListingOrders';

interface TabPanelProps {
  children?: React.ReactNode;
  index: SettingTab;
  value: SettingTab;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const TabsContent: React.FC = () => {
  const currentTab = useAppSelector(({ customisation }) => customisation.currentSettingsTab);
  const widgetType = useAppSelector(({ customisation }) => customisation.options.widgetType);

  return (
    <>
      <TabPanel value={currentTab} index={0}>
        <Grid container item xs={12} spacing={2}>
          {(widgetType !== WidgetType.NFT ? widgetColors : nftWidgetColors).map(param => (
            <ColorPicker color={param} key={param.name} />
          ))}
        </Grid>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <Grid container item xs={12} spacing={2}>
          {notificationColors.map(param => (
            <ColorPicker color={param} key={param.name} />
          ))}
        </Grid>
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        {widgetType !== WidgetType.NFT ? <ChainsSelection /> : <ListingOrders />}
      </TabPanel>
    </>
  );
};
