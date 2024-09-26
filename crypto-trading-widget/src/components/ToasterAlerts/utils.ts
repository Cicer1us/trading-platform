import { Theme } from '@mui/material';
import { Toast, ToastPosition } from 'react-hot-toast';

const TOAST_MIN_HEIGHT = 80;
const TOAST_MIN_WIDTH = 300;
const TOAST_MAX_WIDTH = 340;

export const TOAST_DURATION = 5000;
export const TOAST_POSITION: ToastPosition = 'top-right';
export const GAP_BETWEEN_TOASTS = 14;

export const toasterMessages = {
  assetAllowance: {
    success: {
      title: 'Unlock confirmed',
      description: 'The token was successfully unlocked, continue to purchase.',
    },
    loading: {
      title: 'Unlocking token...',
      description: 'Please, wait while we are unlocking the token.',
    },
    error: {
      title: 'Unlock rejected',
      description: 'We are sorry, but the unlock process was rejected.',
    },
  },
  cancelOrder: {
    success: {
      title: 'Order canceled',
      description: 'The order was successfully canceled.',
    },
    loading: {
      title: 'Canceling order...',
      description: 'Please, wait while we are canceling the order.',
    },
    error: {
      title: 'Order cancelation failed',
      description: 'We are sorry, but the order cancelation process was failed.',
    },
  },
  createOrder: {
    success: {
      title: 'Order created',
      description: 'The order was successfully created.',
    },
    loading: {
      title: 'Creating order...',
      description: 'Please, wait while we are creating the order.',
    },
    error: {
      title: 'Order creation failed',
      description: 'We are sorry, but the order creation process was failed.',
    },
  },
};

export const getToastOptions = (theme: Theme) => ({
  style: {
    minHeight: TOAST_MIN_HEIGHT,
    minWidth: TOAST_MIN_WIDTH,
    maxWidth: TOAST_MAX_WIDTH,
    padding: 8,
  },
  success: {
    duration: TOAST_DURATION,
    style: {
      color: theme.palette.success.contrastText,
      background: theme.palette.success.dark,
    },
  },
  error: {
    duration: TOAST_DURATION,
    style: {
      color: theme.palette.error.contrastText,
      background: theme.palette.error.dark,
    },
  },
  loading: {
    style: {
      color: theme.palette.warning.contrastText,
      background: theme.palette.warning.dark,
    },
  },
});

export const getToastBarStyles = (theme: Theme, toast: Toast) => ({
  display: 'block',
  borderRadius: 5,
  borderLeft: `${theme.spacing(0.5)} solid ${
    (toast.type === 'success' && theme.palette.success.light) ||
    (toast.type === 'error' && theme.palette.error.light) ||
    theme.palette.warning.light
  }`,
});
