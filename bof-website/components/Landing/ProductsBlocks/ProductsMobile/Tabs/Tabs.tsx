import React, { ReactElement, useState } from 'react';
import TabTitle from '../TabsTitle/TabTitle';
import style from './Tabs.module.css';

type Props = {
  children: ReactElement[];
};

const Tabs: React.FC<Props> = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className={style.wrapper}>
      <div className={style.tabsList}>
        {children.map((item, index) => (
          <TabTitle key={index} title={item.props.title} index={index} setSelectedTab={setSelectedTab} />
        ))}
      </div>
      <div> {children[selectedTab]}</div>
    </div>
  );
};

export default Tabs;
