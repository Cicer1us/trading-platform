import { chains, Chains } from 'connection/chainConfig';
import { Alert } from '@/components/Alert/Alert';
import useMultilingual from '@/hooks/useMultilingual';
import { useWeb3React } from '@web3-react/core';
import style from './SameChainError.module.css';
import { switchChain } from 'connection/switchChain';

interface WrongChainErrorProps {
  currentChainId: Chains;
  switchToChainId: Chains;
}

const WrongChainError: React.FC<WrongChainErrorProps> = ({ currentChainId, switchToChainId }) => {
  const { tc } = useMultilingual('widget');
  const { connector } = useWeb3React();

  const switchOnClick = async () => {
    try {
      await switchChain(connector, Number(switchToChainId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Alert severity={'error'}>
      <div className={style.description}>
        {tc('wrongChainTitle')}
        {'. '}
        {`${tc('wrongChainMessage')([chains[currentChainId]?.name])} `}
      </div>
      <div className={`${style.switchNetworkButton} ${style.action}`} onClick={switchOnClick}>
        {tc('switchTo')([chains[switchToChainId]?.name])}
      </div>
    </Alert>
  );
};

export default WrongChainError;
