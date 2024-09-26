import Content from 'pagesContent/Article/Content/Content';
import React from 'react';
import styles from './Terms.module.css';

const Terms = ({ cmsData }): JSX.Element => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Content content={cmsData} />
        </div>
      </div>
    </>
  );
};

export default Terms;
