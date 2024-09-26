import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { WidgetVariantSelection } from './components/WidgetVariantSelection';
import { IntegrationInstructions } from './components/IntegrationInstructions';
import { SettingsTabs } from './components/SettingsTab/SettingsTabs';
import { TabsContent } from './components/TabsContent';
import { STabsGridItem, SIntegrationCard, SSettingCard, SInnerTabsBox } from './styled';

export const WidgetCustomisationPanel: React.FC = () => {
  return (
    <>
      <SSettingCard>
        <Box mb={2}>
          <Typography variant={'h3'} mb={2}>
            {'Select a type of the widget'}
          </Typography>
          <WidgetVariantSelection />
        </Box>

        <Grid container alignItems={'center'}>
          <Grid item xs={12} md={12} lg={6} mb={2}>
            <Typography variant={'h3'}>{'Settings'}</Typography>
          </Grid>

          <STabsGridItem item xs={12} md={12} lg={6}>
            <SInnerTabsBox>
              <SettingsTabs />
            </SInnerTabsBox>
          </STabsGridItem>
        </Grid>

        <TabsContent />
      </SSettingCard>
      <SIntegrationCard>
        <IntegrationInstructions />
      </SIntegrationCard>
    </>
  );
};
