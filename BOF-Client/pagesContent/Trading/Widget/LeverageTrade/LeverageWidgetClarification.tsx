import React from 'react';
import style from './LeverageTrade.module.css';
import Clarification from '@/components/Clarification/Clarification';

interface Props {
  label: string;
  helperText: string;
}

const LeverageWidgetClarification: React.FC<Props> = ({ label, helperText }): JSX.Element => {
  return (
    <div className={style.label}>
      <span className={style.text}>{label}</span>
      <Clarification size={17} helperText={helperText} stroke="var(--secondaryFont)" />
    </div>
  );
};

export default React.memo(LeverageWidgetClarification);
