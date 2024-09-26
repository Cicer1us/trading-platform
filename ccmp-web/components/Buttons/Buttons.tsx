import React from 'react';
import { ClipLoader } from 'react-spinners';
import style from './Buttons.module.css';

type ColorType = 'green' | 'darkGreen' | 'transparent' | 'red' | 'white' | 'dark' | 'darkBlue' | 'default';
type SizeType = 'small' | 'middle' | 'login' | 'big';

interface ButtonSimpleProps {
  color?: ColorType;
  onClick?: () => void;
  children: React.ReactNode;
  size?: SizeType;
  disabled?: boolean;
  isLoading?: boolean;
  border?: boolean;
  className?: string;
}

interface ButtonLinkProps extends Omit<ButtonSimpleProps, 'onClick'> {
  href: string;
}

export const ButtonSimple: React.FC<ButtonSimpleProps> = ({
  color = 'green',
  onClick,
  children,
  size = 'middle',
  disabled = false,
  isLoading = false,
  border = false,
  className,
}: ButtonSimpleProps): JSX.Element => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={`${style.buttonSimple} ${style[color]} ${style[size]} ${border ? style.border : ''} ${
        className ?? ''
      }`}
    >
      {children}
      {isLoading && (
        <div className={style.loader}>
          <ClipLoader color={'#38d9c0'} loading={true} size={20} />
        </div>
      )}
    </button>
  );
};

export const ButtonDark: React.FC<ButtonSimpleProps> = ({
  color = 'green',
  onClick,
  children,
  size = 'small',
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={`${style.buttonSimple} ${style.buttonDark} ${style[color]} ${style[size]}`}
    >
      {children}
    </button>
  );
};

export const ButtonLink: React.FC<ButtonLinkProps> = ({ color, children, href }) => {
  return (
    <a className={style.linkWrapper} href={href} target="_blank" rel="noopener noreferrer">
      <ButtonSimple color={color} onClick={() => null}>
        {children}
      </ButtonSimple>
    </a>
  );
};

export const CustomButton: React.FC<ButtonSimpleProps> = ({
  color = 'dark',
  onClick,
  children,
  size = 'small',
  disabled = false,
  className,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={`${style.buttonSimple} ${style[color]} ${style[size]} ${className ?? ''}`}
    >
      {children}
    </button>
  );
};
