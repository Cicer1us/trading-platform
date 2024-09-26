import { useContext } from 'react';
import { WalletCtx, WalletCtxInterface } from 'context/WalletContext';
import { Chain, checkChainAvailability } from 'utils/chains';
import { ConnectWalletPageContent } from '../ConnectWalletPageContent';
import { SOrdersListSkeleton, SPortfolioSkeleton } from './styled';
import { NftPortfolio } from 'features/NftPortfolio/NftPortfolioGrid';

export const NftPortfolioPageContent = () => {
  const ctx = useContext(WalletCtx) as WalletCtxInterface;
  const isChainAvailable = checkChainAvailability(ctx.walletChain as Chain);

  return (
    <>
      {!ctx || ctx.walletIsLoading ? (
        <>
          <SPortfolioSkeleton variant="rounded" height={618} />
          <SOrdersListSkeleton variant="rounded" height={400} />
        </>
      ) : (
        <>{ctx.account && isChainAvailable ? <NftPortfolio /> : <ConnectWalletPageContent />}</>
      )}
    </>
  );
};
