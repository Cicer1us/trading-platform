import React, { useState } from 'react';
import { Active, ActiveDisabled, DefaultDisabled, Defaut, Hover } from './CheckBoxIcons';
import style from './CheckBox.module.css';

export enum CheckBoxStatus {
  Default = 'default',
  Hover = 'hover',
  Active = 'active',
  Disabled = 'disabled',
  ActiveDisabled = 'activeDisabled',
}

export interface CheckBoxProps {
  value: string;
  title: string;
  status?: CheckBoxStatus;
  icon?: any;
  onChange?: (id: string, status: CheckBoxStatus) => void;
}

export const CheckBox: React.FC<CheckBoxProps> = ({ status, title, onChange, icon, value }) => {
  const [st, setSt] = useState<CheckBoxStatus>(status ?? CheckBoxStatus.Default);

  const handleMouseOver = () => {
    if (st === CheckBoxStatus.Default) {
      setSt(CheckBoxStatus.Hover);
    }
  };
  const handleOnMouseOut = () => {
    if (st === CheckBoxStatus.Hover) {
      setSt(CheckBoxStatus.Default);
    }
  };
  const handleChange = () => {
    let newStatus;
    if (st === CheckBoxStatus.Hover) {
      newStatus = CheckBoxStatus.Active;
    } else if (CheckBoxStatus.Active) {
      newStatus = CheckBoxStatus.Hover;
    }
    setSt(newStatus);
    onChange(value, newStatus);
  };

  const titleStyles = () => {
    return `${style.checkBoxTitle} ${st === CheckBoxStatus.Active ? style.active : ''}`;
  };

  return (
    <div
      className={style.checkBoxWrapper}
      onMouseOver={() => handleMouseOver()}
      onMouseOut={handleOnMouseOut}
      onClick={() => handleChange()}
    >
      <CheckBoxIcon status={st} />
      {icon && icon}
      <p className={titleStyles()}>{title}</p>
    </div>
  );
};

export const CheckBoxIcon: React.FC<{ status: CheckBoxStatus }> = ({ status }) => {
  if (status === CheckBoxStatus.Active) {
    return <Active />;
  } else if (status === CheckBoxStatus.Hover) {
    return <Hover />;
  } else if (status === CheckBoxStatus.Disabled) {
    return <DefaultDisabled />;
  } else if (status === CheckBoxStatus.ActiveDisabled) {
    return <ActiveDisabled />;
  }

  return <Defaut />;
};
