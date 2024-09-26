import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { AlertColor } from '@mui/material/Alert';
import { SAlert, SAlertTitle } from './styled';

interface CustomAlertParams {
  title: string;
  message: string;
  severity: AlertColor;
  action?: JSX.Element;
  link?: string;
}

export const CustomAlert: React.FC<CustomAlertParams> = ({ severity, link, title, message }) => {
  return (
    <SAlert
      icon={false}
      severity={severity}
      variant="filled"
      action={
        <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-end" height="100%">
          {link && (
            <Link href={link} target={'_blank'} underline="always" color={'inherit'}>
              Check
            </Link>
          )}
        </Box>
      }
    >
      <SAlertTitle>{title}</SAlertTitle>
      <Box>{message}</Box>
    </SAlert>
  );
};
