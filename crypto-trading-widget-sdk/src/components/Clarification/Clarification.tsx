import React from 'react';
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
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

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    enterDelay={300}
    enterTouchDelay={0}
    leaveTouchDelay={2000}
    TransitionComponent={Fade}
    TransitionProps={{ timeout: 600 }}
  />
))(({ theme }) => ({
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

export const Clarification: React.FC<ClarificationProps> = ({ title, style, variant, color, description }) => {
  const theme = useTheme();

  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      <Typography variant={variant ?? 'body1'} sx={{ mr: 1 }} color={color ?? 'text.primary'}>
        {title}
      </Typography>
      <CustomTooltip title={description} placement={'top'} arrow>
        <ButtonBase sx={{ stroke: color ?? theme.palette.text?.primary }}>
          <QuestionMarcIcon />
        </ButtonBase>
      </CustomTooltip>
    </div>
  );
};
