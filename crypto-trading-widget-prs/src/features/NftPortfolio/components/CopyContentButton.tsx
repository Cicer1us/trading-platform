import { SxProps, Theme, useTheme } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React from 'react';
import { CustomButton } from 'components/Buttons/CustomButton';
import { CustomTooltip } from 'components/Clarification/Clarification';

interface CopyContentButtonProps {
  content: string;
  sx?: SxProps<Theme>;
  children?: JSX.Element;
}

export const CopyContentButton: React.FC<CopyContentButtonProps> = ({ content, sx = {}, children }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleClick = () => () => {
    navigator.clipboard.writeText(content).then(() => {
      setTimeout(() => setOpen(false), 600);
    });
    setOpen(true);
  };

  return (
    <>
      <CustomTooltip open={open} title={'Copied!'} placement={'top'} arrow>
        <CustomButton
          focusRipple
          onClick={handleClick()}
          sx={{
            color: theme.palette.text?.secondary,
            stroke: theme.palette.text?.primary,
            boxShadow: 'none',
            backgroundColor: 'transparent',
            '&:hover': {
              borderColor: 'transparent',
              backgroundColor: 'transparent',
            },
            ...sx,
          }}
        >
          {children}
          <ContentCopyIcon fontSize="small" />
        </CustomButton>
      </CustomTooltip>
    </>
  );
};
