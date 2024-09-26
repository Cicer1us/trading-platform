import { ClipLoader } from 'react-spinners';
import style from './ConnectWallet.module.css';

interface OptionProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  link?: string;
}

const WalletOption = ({ icon, title, onClick, isActive, link, isLoading = false }: OptionProps) => {
  if (link) {
    return (
      <a className={`${style.walletOption}`} href={link} target="_blank" rel="noopener noreferrer">
        <div>{icon}</div>
        <div>{title}</div>
      </a>
    );
  }
  return (
    <div className={`${style.walletOption} ${isActive ? style.walletOptionDisabled : ''}`} onClick={onClick}>
      <div>{icon}</div>
      <div>{title}</div>
      {isLoading && (
        <div className={style.loader}>
          <ClipLoader color={'var(--green)'} size={18} />
        </div>
      )}
    </div>
  );
};

export default WalletOption;
