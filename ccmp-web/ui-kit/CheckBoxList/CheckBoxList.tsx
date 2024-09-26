import React, { useState } from 'react';
import { CheckBox, CheckBoxProps, CheckBoxStatus } from '../CheckBox/CheckBox';

interface CheckBoxListProps {
  wrapperStyles?: string;
  onChange: (selected: string[]) => void;
  checkBoxes: CheckBoxProps[];
}

export const CheckBoxList: React.FC<CheckBoxListProps> = ({ checkBoxes, onChange, wrapperStyles }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelection = (id: string, status: CheckBoxStatus) => {
    if (status === CheckBoxStatus.Active) {
      selected.push(id);
    } else {
      const index = selected.indexOf(id);
      selected.splice(index, 1);
    }
    setSelected(selected);
    onChange(selected);
  };

  return (
    <div className={wrapperStyles ?? ''}>
      {checkBoxes.map(({ title, status, icon, value }) => (
        <CheckBox title={title} status={status} icon={icon} onChange={handleSelection} value={value} key={value} />
      ))}
    </div>
  );
};
