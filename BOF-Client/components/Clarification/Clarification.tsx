import React, { useState } from 'react';
import style from './Clarification.module.css';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import FAQIcon from '@/icons/FAQIcon';
import { isMobile } from 'react-device-detect';

interface ClarificationProps {
  helperText: string;
  stroke?: string;
  size?: number;
}

const Clarification: React.FC<ClarificationProps> = ({ helperText, stroke, size = 17 }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip({
    trigger: 'hover',
    closeOnOutsideClick: true,
    visible: isActive,
    onVisibleChange: setIsActive,
    closeOnTriggerHidden: true,
    placement: 'right',
    offset: [0, 10],
    interactive: true,
  });

  return (
    !isMobile && (
      <>
        <span
          className={style.wrapper}
          ref={setTriggerRef}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setIsActive(!isActive);
          }}
        >
          <FAQIcon size={size} stroke={stroke} />
        </span>

        {visible && (
          <div
            ref={setTooltipRef}
            {...getTooltipProps({ className: `tooltip-container ${style.tooltipContainer}`, style: { zIndex: 1999 } })}
          >
            <span>{helperText}</span>
            <div {...getArrowProps({ className: `tooltip-arrow ${style.tooltipArrow}` })} />
          </div>
        )}
      </>
    )
  );
};

export default React.memo(Clarification);
