import React from 'react';
import style from './DropdownButton.module.css';
import ArrowDropdownIcon from '@/assets/icons/ArrowDropdownIcon';

interface DropdownButtonProps {
  id: number;
  handleDropdown: (id: number) => void;
  isActive: boolean;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  id,
  handleDropdown,
  isActive,
}: DropdownButtonProps): JSX.Element => {
  return (
    <td className={style.td}>
      <button className={`${style.button} ${isActive ? style.active : ''}`} onClick={() => handleDropdown(id)}>
        <ArrowDropdownIcon className={style.icon} />
      </button>
    </td>
  );
};

export default React.memo(DropdownButton);
