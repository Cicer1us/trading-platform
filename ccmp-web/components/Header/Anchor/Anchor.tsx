import React from 'react';
import style from './Anchor.module.css';
import { Link } from 'react-scroll';

export interface AnchorProps {
  children: React.ReactNode;
  idAnchor: string;
}

const Anchor: React.FC<AnchorProps> = ({ children, idAnchor }: AnchorProps): JSX.Element => (
  <Link activeClass={style.activeLink} className={style.link} to={idAnchor} spy smooth duration={1000}>
    {children}
  </Link>
);

export default React.memo(Anchor);
