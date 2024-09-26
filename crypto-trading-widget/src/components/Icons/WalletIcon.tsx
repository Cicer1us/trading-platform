import React from 'react';
import { SvgIcon } from '@mui/material';

export const WalletIcon: React.FC = () => {
  return (
    <SvgIcon width="16" height="16" viewBox="0 0 16 16" sx={{ fontSize: 16 }} style={{ fill: 'none' }}>
      <g clipPath="url(#clip0_551_6227)">
        <path
          d="M13.9989 2.66699H1.99886C1.26248 2.66699 0.665527 3.26395 0.665527 4.00033V12.0003C0.665527 12.7367 1.26248 13.3337 1.99886 13.3337H13.9989C14.7352 13.3337 15.3322 12.7367 15.3322 12.0003V4.00033C15.3322 3.26395 14.7352 2.66699 13.9989 2.66699Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10.6655 6L15.3322 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M10.6655 5C10.1722 5 9.4544 5.13978 8.83122 5.58847C8.15706 6.07386 7.66553 6.87408 7.66553 8H9.66553C9.66553 7.52592 9.84066 7.32614 9.99983 7.21153C10.21 7.06022 10.4922 7 10.6655 7V5ZM7.66553 8C7.66553 9.12592 8.15706 9.92614 8.83122 10.4115C9.4544 10.8602 10.1722 11 10.6655 11V9C10.4922 9 10.21 8.93978 9.99983 8.78847C9.84066 8.67386 9.66553 8.47408 9.66553 8H7.66553Z"
          fill="#C5C5C9"
        />
        <path d="M10.6655 10L15.3322 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_551_6227">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
};
