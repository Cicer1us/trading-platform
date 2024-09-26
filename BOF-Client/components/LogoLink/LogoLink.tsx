import React from 'react';
import { MAIN } from '@/common/LocationPath';

export interface LogoLinkProps {
  children: React.ReactNode;
}

const LogoLink: React.FC<LogoLinkProps> = ({ children }: LogoLinkProps): JSX.Element => {
  return (
    <a href={MAIN} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default LogoLink;
