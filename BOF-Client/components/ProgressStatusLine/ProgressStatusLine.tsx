import { ProgressStatusCompletedIcon, ProgressStatusErrorIcon } from '@/assets/icons/ProgressStatusIcon';
import style from './ProgressStatusLine.module.css';

export enum ProgressStatus {
  NONE = 'NONE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

interface AnimatedDashedLineProps {
  status: ProgressStatus;
}

const ProgressStatusLine: React.FC<AnimatedDashedLineProps> = ({ status }): JSX.Element => {
  return (
    <div className={style.container}>
      {status === ProgressStatus.IN_PROGRESS && (
        <div className={style.animatedLine}>
          {new Array(50).fill(0).map(() => (
            <div className={style.dash} style={{ backgroundColor: 'var(--green)' }}></div>
          ))}
        </div>
      )}
      {status === ProgressStatus.NONE && (
        <div className={style.line} style={{ backgroundColor: 'var(--darkGray)' }}></div>
      )}
      {status === ProgressStatus.COMPLETED && (
        <div className={style.line} style={{ backgroundColor: 'var(--green)' }}></div>
      )}
      {status === ProgressStatus.ERROR && <div className={style.line} style={{ backgroundColor: 'var(--red)' }}></div>}

      {status !== ProgressStatus.IN_PROGRESS && (
        <div className={style.statusIcon}>
          {status === ProgressStatus.COMPLETED && <ProgressStatusCompletedIcon width={18} height={18} />}
          {status === ProgressStatus.ERROR && <ProgressStatusErrorIcon width={18} height={18} />}
        </div>
      )}
    </div>
  );
};

export default ProgressStatusLine;
