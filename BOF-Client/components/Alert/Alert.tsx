import React from 'react';
import style from './Alert.module.css';

export enum AlertSeverity {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
}

interface AlertProps {
  severity: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, severity, className }) => {
  return (
    <div className={`${style.body} ${style[severity]} ${className}`}>
      <div className={style.notify}>
        <div className={style.notifyMessage}>{children}</div>
      </div>
    </div>
  );
};
