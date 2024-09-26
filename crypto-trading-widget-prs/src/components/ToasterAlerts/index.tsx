import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { ToastBar, Toaster } from 'react-hot-toast';

import { TOAST_POSITION, GAP_BETWEEN_TOASTS, getToastOptions, getToastBarStyles } from './utils';

export const ToasterAlerts: React.FC = () => {
  const theme = useTheme();
  const options = useMemo(() => getToastOptions(theme), [theme]);

  return (
    <Toaster position={TOAST_POSITION} gutter={GAP_BETWEEN_TOASTS} toastOptions={options}>
      {toast => (
        <ToastBar toast={toast} style={getToastBarStyles(theme, toast)}>
          {({ message }) => message}
        </ToastBar>
      )}
    </Toaster>
  );
};
