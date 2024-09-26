import { ChainId } from 'src/connection/types';
import Image from 'next/image';
import { CHAINS } from 'src/connection/chains';

interface ChainIconProps {
  chainId: ChainId;
}

export const ChainIcon: React.FC<ChainIconProps> = ({ chainId = ChainId.MAINNET }: ChainIconProps) => {
  const chainName = CHAINS[chainId].name.toLowerCase();

  return <Image src={`/images/chains/${chainName}.svg`} width={20} height={20} alt={chainName} priority />;
};
