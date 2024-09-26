import React from 'react';
import style from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }: CardProps) => {
  return <div className={`${style.card} ${className} `}>{children}</div>;
};

export default Card;
