import React from 'react';
import { Card, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

interface PropTypes {
  imgUrl: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
}

const BasicCard = ({ imgUrl, title, paragraph1, paragraph2 }: PropTypes) => {
  const theme = useTheme();
  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          padding: '32px',
          width: '100%',
          gap: '10px',
        }}
      >
        <Image src={imgUrl} alt="token" width={72} height={72} unoptimized />
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body1" color={theme.palette.text.secondary}>
          {paragraph1}
        </Typography>
        <Typography variant="body1" color={theme.palette.text.secondary} marginTop={2} marginBottom={2}>
          {paragraph2}
        </Typography>
      </Card>
    </>
  );
};

export default BasicCard;
