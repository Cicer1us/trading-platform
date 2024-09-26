import React, { forwardRef } from 'react';
import { ButtonBase, Tooltip, tooltipClasses, TooltipProps, Typography, useTheme } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import Fade from '@mui/material/Fade';
import { QuestionMarcIcon } from '../Icons/QuestionMarcIcon';
import { styled } from '@mui/material/styles';

interface ClarificationProps {
  title: string;
  description: string;
  style?: React.CSSProperties;
  variant?: Variant;
  color?: string;
}

const SCustomTooltip = styled(Tooltip)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.main}`,
    padding: 12,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontFamily: 'Inter',
    fontSize: 12,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
  },
}));

export const CustomTooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  return (
    <SCustomTooltip
      ref={ref}
      {...props}
      classes={{ popper: props.className }}
      enterDelay={300}
      enterTouchDelay={0}
      leaveTouchDelay={2000}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
    />
  );
});

export const Clarification: React.FC<ClarificationProps> = ({ title, style, variant, color, description }) => {
  const theme = useTheme();

  return (
    <div style={{ display: 'flex', ...style }}>
      <Typography variant={variant ?? 'body1'} style={{ marginRight: 7, color }}>
        {title}
      </Typography>
      <CustomTooltip title={description} placement={'top'} arrow>
        <ButtonBase style={{ stroke: theme.palette.text?.secondary }}>
          <QuestionMarcIcon />
        </ButtonBase>
      </CustomTooltip>
    </div>
  );
};
