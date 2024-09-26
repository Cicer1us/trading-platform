import dayjs from 'dayjs';
import React from 'react';
import style from './MarketArticleCard.module.css';
import Image from 'next/image';
interface MarketArticleCardProps {
  imgUrl: string;
  title: string;
  date: string;
  slug: string;
}

const MarketArticleCard: React.FC<MarketArticleCardProps> = ({ imgUrl, title, date, slug }) => {
  const dateToDisplay = dayjs(date).format('MMMM DD, YYYY');
  return (
    <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer" className={style.card}>
      <div className={style.img}>
        <Image src={`https://${imgUrl}`} alt={title} objectFit={'cover'} layout="fill" />
      </div>
      <div className={style.body}>
        <div className={style.date}>{dateToDisplay}</div>
        <div className={style.title}> {title}</div>
      </div>
    </a>
  );
};

export default MarketArticleCard;
