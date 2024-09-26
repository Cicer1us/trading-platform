import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';
import React from 'react';
import style from './Crumbs.module.css';

interface Crumb {
  title: string;
  link: string;
}

interface CrumbsProps {
  crumbs: Crumb[];
}

export const Crumbs: React.FC<CrumbsProps> = ({ crumbs }) => {
  return (
    <div className={style.crumbs}>
      <div className={style.links}>
        {crumbs.map((crumb, index) => (
          <React.Fragment key={crumb.link}>
            {index !== 0 && <div>{' / '}</div>}
            {crumb.link ? (
              <a href={crumb.link} className={style.link} target="_self">
                {index === 0 && <ArrowLeftIcon />}
                {crumb.title}
              </a>
            ) : (
              <div>{crumb.title}</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
