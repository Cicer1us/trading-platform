import { TRADING_SWAP } from '@/common/LocationPath';
import { Alert } from '@/components/Alert/Alert';
import { Token } from '@/interfaces/Tokens.interface';
import style from './SameChainError.module.css';

interface SameChainErrorProps {
  srcToken: Token;
  destToken: Token;
}

const SameChainError: React.FC<SameChainErrorProps> = ({ srcToken, destToken }) => {
  const link = `${TRADING_SWAP}/${srcToken?.address}/${destToken?.address}`;
  return (
    <Alert severity={'error'}>
      <p>
        You chosen same network for both token. Follow the{' '}
        <a className={style.link} href={link} target="_blank" rel="noopener noreferrer">
          Link
        </a>{' '}
        to make instant swaps.
      </p>
    </Alert>
  );
};

export default SameChainError;
