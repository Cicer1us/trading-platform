import React from 'react';
import style from './Popup.module.css';
import { Config, usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import { isMobile } from 'react-device-detect';

interface PopupProps {
  children: React.ReactNode;
  popupText: string;
  active: boolean;
  width?: number;
}

const defaultPopupConfig: Partial<Config> = {
  trigger: 'hover',
  closeOnOutsideClick: true,
  closeOnTriggerHidden: true,
  placement: 'top',
  offset: [0, 10],
  interactive: true,
};

const Popup: React.FC<PopupProps> = ({ children, width = 140, popupText, active }: PopupProps) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(defaultPopupConfig);

  return (
    <>
      <div ref={setTriggerRef}>{children}</div>
      {active && visible && !isMobile && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: `tooltip-container ${style.tooltipContainer} ${style.tooltip}`,
            style: { zIndex: 9999, width },
          })}
        >
          <span>{popupText}</span>
          <div {...getArrowProps({ className: `tooltip-arrow ${style.tooltipArrow}` })} />
        </div>
      )}
    </>
  );
};

export default React.memo(Popup);
