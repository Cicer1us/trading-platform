import React from 'react';
import style from './TabTitle.module.css';

type Props = {
  title: string;
  index: number;
  setSelectedTab: (index: number) => void;
};

const TabTitle: React.FC<Props> = ({ title, setSelectedTab, index }) => {
  return (
    <button onClick={() => setSelectedTab(index)} className={style.btn}>
      <div className={style.title}>{title}</div>
    </button>
  );
};

export default TabTitle;
