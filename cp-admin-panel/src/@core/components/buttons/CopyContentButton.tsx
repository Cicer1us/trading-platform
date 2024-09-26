import { Button, styled, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState, useCallback } from 'react';

export const StyledCopyButton = styled(Button, {
  name: 'StyledCopyButton'
})(({ theme }) => ({
  minWidth: 0,
  padding: 0,
  color: theme.palette.text?.secondary
}));

interface CopyContentButtonProps {
  content?: string;
}

export const CopyContentButton: React.FC<CopyContentButtonProps> = ({ content }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleCopyClick = useCallback(() => {
    setIsTooltipOpen(true);
    navigator.clipboard.writeText(content ?? '');
    setTimeout(() => setIsTooltipOpen(false), 800);
  }, [content]);

  return (
    <Tooltip open={isTooltipOpen} title={'Copied!'} placement={'top'} arrow>
      <StyledCopyButton onClick={handleCopyClick}>
        <ContentCopyIcon fontSize='small' />
      </StyledCopyButton>
    </Tooltip>
  );
};
