import { ReactNode } from 'react';
import NtfAppBar from 'features/NftPortfolio/components/NftAppBar';
import { NftFooter } from 'features/NftPortfolio/components/NftFooter';
import { SLayoutContentWrapper, SWrapper } from './styled';

export const NftPortfolioLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SWrapper>
      <NtfAppBar />
      <SLayoutContentWrapper maxWidth={'xl'}>{children}</SLayoutContentWrapper>
      <NftFooter />
    </SWrapper>
  );
};
