import React from 'react';
import style from './LeverageOnboarding.module.css';
import BeatLoader from 'react-spinners/BeatLoader';

const WidgetLoader = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.loaderWrapper}>
          <BeatLoader color={'var(--green)'} loading={true} size={20} />
        </div>
      </div>
    </>
  );
};

export default WidgetLoader;
