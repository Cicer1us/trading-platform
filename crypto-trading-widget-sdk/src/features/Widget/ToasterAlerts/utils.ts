import { Theme } from '@mui/material';
import { ToastPosition } from 'react-hot-toast';

const TOAST_MIN_HEIGHT = 72;
const TOAST_MIN_WIDTH = 360;

export const TOAST_DURATION = 4000;
export const TOAST_POSITION: ToastPosition = 'top-right';
export const GAP_BETWEEN_TOASTS = 14;

interface ToastMessage {
  title: string;
  description: string;
}
export interface ToasterMessages {
  allowanceTx: Record<'success', ToastMessage>;
  nftPurchaseTx: Record<'success' | 'error' | 'rejected' | 'loading', ToastMessage>;
  defaultTMessages: Record<'success' | 'error' | 'loading', ToastMessage>;
  createSwap: Record<'success' | 'error' | 'loading', ToastMessage>;
}

export const toasterMessages: ToasterMessages = {
  nftPurchaseTx: {
    success: {
      title: 'Transaction success',
      description: 'The NFT was purchased successfully',
    },
    loading: {
      title: 'Transaction in progress',
      description: 'Please wait, your transaction is pending.',
    },
    error: {
      title: 'Transaction error',
      description: 'The error occurred. Please, try again.',
    },
    rejected: {
      title: 'Purchase rejected',
      description: 'Unfortunately, the purchase was rejected.',
    },
  },
  allowanceTx: {
    success: {
      title: 'Unlock confirmed',
      description: 'The token was successfully unlocked.',
    },
  },
  defaultTMessages: {
    success: {
      title: 'Transaction success',
      description: 'The transaction was successfully done.',
    },
    loading: {
      title: 'Transaction in progress',
      description: 'Please wait, your transaction is pending.',
    },
    error: {
      title: 'Transaction error',
      description: 'The error occurred. Please, try again.',
    },
  },
  createSwap: {
    loading: {
      title: 'Swap in progress',
      description: 'Please wait, your transaction is pending.',
    },
    success: {
      title: 'Swap completed',
      description: 'The swap was successfully completed.',
    },
    error: {
      title: 'Swap error',
      description: 'The error occurred. Please, try again.',
    },
  },
};

export const getToastOptions = (theme: Theme) => ({
  style: {
    minHeight: TOAST_MIN_HEIGHT,
    minWidth: TOAST_MIN_WIDTH,
    padding: 6,
  },
  success: {
    duration: TOAST_DURATION,
    style: {
      color: theme.palette.success.contrastText,
      backgroundColor: theme.palette.success.main,
    },
  },
  error: {
    duration: TOAST_DURATION,
    style: {
      color: theme.palette.error.contrastText,
      backgroundColor: theme.palette.error.main,
    },
  },
  loading: {
    style: {
      color: theme.palette.warning.contrastText,
      backgroundColor: theme.palette.warning.main,
    },
  },
});
