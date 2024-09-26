import React from 'react';
import style from './BlogCard.module.css';
import ArrowDropdownIcon from 'assets/icons/ArrowDropdownIcon';
import CalendarIcon from 'assets/icons/CalendarIcon';
import Link from 'next/link';

interface CardProps {
  linkPath: string;
  imgUrl: string;
  title: string;
  date: string;
  type: string;
}

const BlogCard: React.FC<CardProps> = ({ linkPath, imgUrl, title, date, type }: CardProps): JSX.Element => {
  return (
    <div className={style.wrapper}>
      <Link
        href={linkPath}
        className={`${style.card} ${type === 'carousel' ? style.carousel : ''} ${
          type === 'standard' ? style.categories : ''
        }`}
        draggable="false"
      >
        <div className={`${style.wrapperImage} `}>
          <img src={imgUrl} alt={title} className={style.image} />
        </div>
        <div className={style.cardContent}>
          <div className={style.cardHeader}>
            <div className={style.cardIcon}>
              <CalendarIcon />
            </div>
            <div className={style.cardDate}>{date}</div>
          </div>
          <h3 className={style.cardTitle}>{title}</h3>
          <div className={style.cardFooter}>
            <div className={style.cardReadMore}>
              {'Read more'}
              <div className={style.cardArrow}>
                <ArrowDropdownIcon stroke="var(--green)" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default React.memo(BlogCard);
