import React from 'react';
import { Card, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';

interface PropTypes {
  sx: object;
  title: string;
  content: string;
}

const GridCard = ({ sx, title, content }: PropTypes) => {
  const theme = useTheme();
  return (
    <>
      <Card sx={{ ...sx }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, marginTop: '16px' }}>
          {content}
        </Typography>
      </Card>
    </>
  );
};

export default GridCard;
