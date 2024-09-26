import React, { useEffect, useState } from 'react';
import { WidgetNft } from '../features/WidgetNft';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { WidgetOptions } from 'redux/customisationSlice';

interface WidgetNftPageProps {
  widgetOptions?: WidgetOptions;
}

export const WidgetNftPage: React.FC<WidgetNftPageProps> = ({ widgetOptions }) => {
  const [orderHash, setOrderHash] = useState<string | null>(null);

  const openOrder = (orderHashToSet: string) => {
    setOrderHash(orderHashToSet);
  };

  const closeOrder = () => {
    setOrderHash(null);
  };

  useEffect(() => {
    window.CryptoTradingWidget.openOrder = openOrder;
  }, []);

  return (
    <>
      {orderHash ? (
        <Modal
          open={true}
          onClose={() => closeOrder()}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ border: 'none', borderWidth: 0 }}
          disableAutoFocus={true}
        >
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {orderHash ? <WidgetNft orderHash={orderHash} widgetOptions={widgetOptions} /> : <></>}
          </Box>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};
