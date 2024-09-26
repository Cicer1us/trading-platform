import style from './CustomToastContainer.module.css';
import { ToastContainer, toast, Id, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { ReactNode, ReactText } from 'react';
import CloseIcon from '@/assets/icons/CloseIcon';
import { chains, Chains } from 'connection/chainConfig';
import { isMobile } from 'react-device-detect';

export interface LinkToast {
  hash: string;
  chainId: Chains;
}

const defaultOptions: Partial<ToastOptions> = {
  position: 'top-right',
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
};

const CustomToastContainer: React.FC = (): JSX.Element => {
  return (
    <ToastContainer
      autoClose={isMobile ? 5000 : 10000}
      closeButton={CloseButton}
      className={`${style.wrapper}`}
      toastClassName={({ type }): string => `${style[type || 'default']} ${style.body}`}
      progressClassName={`${style.progressBarWrapper} ${style.progressBar}`}
    />
  );
};

const CloseButton = ({ closeToast }) => (
  <button type="button" onClick={closeToast} className={style.closeButton}>
    <CloseIcon />
  </button>
);

export default CustomToastContainer;

const notifyContent = (title: string, message: string, link?: LinkToast): JSX.Element => {
  return (
    <div>
      {title && <div className={style.notifyTitle}>{title}</div>}
      <div className={style.messageContainer}>
        <div className={style.notifyMessage}>{message}</div>
        <div className={style.progressBackground} />
        {link?.chainId && link?.hash && (
          <div className={`${style.notifyLink}`}>
            <a
              href={`${chains[link.chainId].explorerUrl}/tx/${link.hash}`}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Check
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export enum NotifyEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  PENDING = 'warning',
  NOLINK = 'warning',
  CUSTOM = 'custom',
}

interface NotifyParams {
  state: NotifyEnum;
  content?: ReactNode;
  title?: string;
  message?: string;
  link?: LinkToast;
  options?: Partial<ToastOptions>;
}

export const Notify = (params: NotifyParams): ReactText | void => {
  const toastOptions = {
    ...defaultOptions,
    ...params.options,
  };
  if (params.state === NotifyEnum.CUSTOM) return toast(params.content, toastOptions);
  return toast[params.state](notifyContent(params.title, params.message, params.link), toastOptions);
};

export const NotifyDismiss = (toastId?: Id): void => {
  toast.dismiss(toastId);
};
