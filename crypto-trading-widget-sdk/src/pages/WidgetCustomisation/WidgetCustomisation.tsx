import React, { useState } from 'react';
import { Grid, Modal, useMediaQuery, Theme } from '@mui/material';
import { useAppSelector } from '../../redux/hooks/reduxHooks';
import { WidgetType } from 'redux/customisationSlice';
import { WidgetCustomisationPanel } from 'features/WidgetCustomisationPanel';
import { Widget } from 'features/Widget';
import { StickyButton } from 'features/WidgetCustomisationPanel/components/StickyButton';
import { ListingRedirectionBox } from 'features/WidgetCustomisationPanel/components/ListingRedirectionBox/ListingRedirectionBox';
import { WidgetNft } from 'features/WidgetNft';
import { ON_SALE_NFT_ORDER_HASH } from '../../constants';
import { SModalInnerBox, StyledContainer } from './styled';

export const WidgetCustomization: React.FC = () => {
  const customisationSettings = useAppSelector(({ customisation }) => customisation);
  const widgetType = useAppSelector(({ customisation }) => customisation.options.widgetType);

  const [displayWidget, setDisplayWidget] = useState(false);
  const hidden = useMediaQuery((thm: Theme) => thm.breakpoints.up('md'));

  return (
    <StyledContainer>
      <Grid container spacing={3}>
        <Grid item xl={8} lg={7} md={6} xs={12}>
          <WidgetCustomisationPanel />
        </Grid>
        <Grid item xl={4} lg={5} md={6} xs={12}>
          {hidden && (
            <>
              {widgetType !== WidgetType.NFT ? (
                <Widget widgetOptions={customisationSettings.options} />
              ) : (
                <WidgetNft widgetOptions={customisationSettings.options} orderHash={ON_SALE_NFT_ORDER_HASH} />
              )}
            </>
          )}

          {!hidden && (
            <Modal open={displayWidget}>
              <SModalInnerBox>
                {widgetType !== WidgetType.NFT ? (
                  <Widget widgetOptions={customisationSettings.options} onCloseClick={() => setDisplayWidget(false)} />
                ) : (
                  <WidgetNft
                    widgetOptions={customisationSettings.options}
                    orderHash={ON_SALE_NFT_ORDER_HASH}
                    onCloseClick={() => setDisplayWidget(false)}
                  />
                )}
              </SModalInnerBox>
            </Modal>
          )}
          {hidden && widgetType === WidgetType.NFT && <ListingRedirectionBox />}
        </Grid>
      </Grid>
      {!hidden && <StickyButton onClick={() => setDisplayWidget(true)} />}
    </StyledContainer>
  );
};
