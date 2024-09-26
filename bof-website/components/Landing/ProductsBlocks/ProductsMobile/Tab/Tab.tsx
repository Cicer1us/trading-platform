import React from 'react';
import style from './Tab.module.css';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
};

const Tab = (props: Props) => {
  return <div className={style.content}>{props.children}</div>;
};

export default Tab;
