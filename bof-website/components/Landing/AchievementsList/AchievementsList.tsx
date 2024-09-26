import React from 'react';
import style from './AchievementsList.module.css';

const AchievementsList = (): JSX.Element => {
  return (
    <>
      <div className={style.achievementsList}>
        <div className={style.content}>
          <div className={style.achievementsTitle}>1800+</div>
          <div className={style.achievementsSubitle}>Tokens</div>
        </div>
        <div className={style.content}>
          <div className={style.achievementsTitle}>4+</div>
          <div className={style.achievementsSubitle}>Products</div>
        </div>
        <div className={style.content}>
          <div className={style.achievementsTitle}>5+</div>
          <div className={style.achievementsSubitle}>Networks</div>
        </div>
      </div>
    </>
  );
};

export default AchievementsList;
