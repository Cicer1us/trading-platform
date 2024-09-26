import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CustomTooltip } from 'components/Clarification/Clarification';

interface CopyContentButtonProps {
  content: string;
  sx?: SxProps<Theme>;
  children?: JSX.Element;
}

export const CopyContentButton: React.FC<CopyContentButtonProps> = ({ content, sx = {}, children }) => {
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
        <ButtonBase focusRipple onClick={handleClick()} sx={sx}>
          {children}
          <ContentCopyIcon />
        </ButtonBase>
      </CustomTooltip>
    </>
  );
};
