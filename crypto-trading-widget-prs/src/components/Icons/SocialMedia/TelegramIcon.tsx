import React from 'react';
import { SvgIcon } from '@mui/material';
import theme from 'theme/theme';

export const TelegramIcon = () => (
  <SvgIcon
    htmlColor="#C5C9C9"
    fontSize="medium"
    viewBox="0 0 23 18"
    xmlns="http://www.w3.org/2000/svg"
    sx={{ '&:hover': { color: theme.palette.text.primary } }}
  >
    <path d="M17.3671 1.25272L14.3071 13.8647C14.1631 14.4587 13.4971 14.7647 12.951 14.4826L9.08086 12.4847L7.25086 15.4787C6.75293 16.2947 5.49293 15.9407 5.49293 14.9866V11.6506C5.49293 11.3926 5.60087 11.1466 5.7869 10.9666L13.3291 3.76661C13.323 3.67661 13.227 3.59867 13.1311 3.66456L4.13113 9.92856L1.10716 8.36856C0.39923 8.00252 0.42923 6.97649 1.16113 6.65856L16.0713 0.160732C16.7853 -0.151323 17.5534 0.490732 17.3673 1.25266L17.3671 1.25272Z" />
  </SvgIcon>
);
