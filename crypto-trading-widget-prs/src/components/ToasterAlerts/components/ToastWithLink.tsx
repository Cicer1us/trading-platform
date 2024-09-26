import React from 'react';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { Typography, Box, Link, styled, LinkProps, Theme } from '@mui/material';

type ToastAction = 'success' | 'error' | 'loading';
interface ToastWithLinkProps {
  title: string;
  description: string;
  action: ToastAction;
  explorerUrl?: string;
  receipt?: TransactionReceipt;
  response?: TransactionResponse;
}

interface SToastLinkProps extends LinkProps {
  action: ToastAction;
}

const getLinkColorByAction = (action: ToastAction, theme: Theme) => {
  switch (action) {
    case 'success':
      return theme.palette.success.main;
    case 'error':
      return theme.palette.error.main;
    case 'loading':
      return theme.palette.warning.main;
  }
};

const SToastLink = styled(({ action, ...props }: SToastLinkProps) => <Link {...props} />, {
  name: 'SToastLink',
})(({ theme, action }) => ({
  fontWeight: 700,
  alignSelf: 'flex-end',
  color: getLinkColorByAction(action, theme),
}));

export const ToastWithLink: React.FC<ToastWithLinkProps> = ({
  title,
  description,
  action,
  explorerUrl,
  receipt,
  response,
}) => {
  let link = '';

  if (receipt) link = new URL(`tx/${receipt.transactionHash}`, explorerUrl).toString();
  if (response) link = new URL(`tx/${response.hash}`, explorerUrl).toString();

  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} width={'100%'} height={'100%'}>
      <Typography variant="h6">{`${title}.`}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      {link && (
        <SToastLink action={action} href={link} target={'_blank'} underline="always" color={'inherit'} fontSize={14}>
          {'Check'}
        </SToastLink>
      )}
    </Box>
  );
};
