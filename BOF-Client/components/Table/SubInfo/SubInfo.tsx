import React from 'react';
import style from './SubInfo.module.css';

interface SubInfoProps {
  colSpan: number;
  SubInfoComponent: (row: any) => JSX.Element;
  row: any;
}

const SubInfo: React.FC<SubInfoProps> = ({ colSpan, SubInfoComponent, row }: SubInfoProps): JSX.Element => {
  return (
    <tr className={style.subInfoWrapper}>
      <td style={{ padding: 0 }} colSpan={colSpan}>
        <SubInfoComponent row={row} />
      </td>
    </tr>
  );
};

export default React.memo(SubInfo);
