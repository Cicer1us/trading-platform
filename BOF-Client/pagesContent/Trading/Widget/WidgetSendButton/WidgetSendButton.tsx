import React from 'react';
import style from './WidgetSendButton.module.css';
import ConnectButtonWrapper from '@/components/ConnectButtonWrapper/ConnectButtonWrapper';
import { ClipLoader } from 'react-spinners';

interface WidgetSendButtonProps {
  onClick: () => void;
  title: string;
  disabled: boolean;
  isLoading?: boolean;
}

const WidgetSendButton: React.FC<WidgetSendButtonProps> = ({
  onClick,
  title,
  disabled,
  isLoading,
}: WidgetSendButtonProps): JSX.Element => {
  return (
    <div className={style.wrapper}>
      <ConnectButtonWrapper>
        <button disabled={disabled} type="button" onClick={onClick} className={`${style.button} ${style.connect}`}>
          {title}
          {isLoading && (
            <div>
              <ClipLoader color={'#38d9c0'} loading={true} size={20} />
            </div>
          )}
        </button>
      </ConnectButtonWrapper>
    </div>
  );
};

export default React.memo(WidgetSendButton);
