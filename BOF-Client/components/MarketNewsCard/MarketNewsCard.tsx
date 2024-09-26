import dayjs from 'dayjs';
import React from 'react';
import style from './MarketNewsCard.module.css';

interface MarketsNewsCardProps {
  source: string;
  title: string;
  date: string;
  url: string;
}

export const MarketsNewsCard: React.FC<MarketsNewsCardProps> = ({ source, title, date, url }: MarketsNewsCardProps) => {
  const dateToDisplay = dayjs(date).format('MMMM DD, YYYY');
  return (
    <div className={style.card}>
      <div className={style.metadata}>
        <div className={style.links}>
          <div>
            <span>by </span>
            <a href={`https://${source}`} target="_blank" rel="noopener noreferrer">
              {source}
            </a>
          </div>
          <div>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Discuss on CryptoPanic
            </a>
          </div>
        </div>
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.date}>
        <div>{dateToDisplay}</div>
      </div>
    </div>
  );
};
