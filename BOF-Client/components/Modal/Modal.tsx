import Portal from '@/hooks/usePortal';
import React from 'react';
import style from './Modal.module.css';

export interface ModalProps {
  active: boolean;
  setActive: (a: boolean) => void;
  children: React.ReactNode;
  isError?: boolean;
  enableBodyScrollWhenActive?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  active,
  setActive,
  children,
  className = '',
  enableBodyScrollWhenActive = false,
  isError = false,
}: ModalProps): JSX.Element => (
  <Portal isVisible={active} enableBodyScrollWhenActive={enableBodyScrollWhenActive}>
    <div
      className={`${style.modal} ${active ? style.active : ''} ${isError ? style.error : ''}`}
      onClick={(): void => setActive(false)}
    >
      <div className={`${style.content} ${className ?? ''}`} onClick={(e): void => e.stopPropagation()}>
        <button className={style.button} type="button" onClick={(): void => setActive(false)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15" stroke="#C5C5C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 5L15 15" stroke="#C5C5C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  </Portal>
);

export default Modal;
