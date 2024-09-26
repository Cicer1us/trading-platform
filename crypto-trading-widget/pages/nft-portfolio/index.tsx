import { MetaTags } from 'components/MetaTags/MetaTags';
import { NftPortfolioPageContent } from 'features/NftPortfolio/components/PageContent';
import { NftPortfolioLayout } from 'layouts/PortfolioLayout';

const NftPortfolioPage = () => {
  return (
    <>
      <MetaTags
        title={'Nft portfolio'}
        description={'Nft portfolio'}
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={''}
      />

      <NftPortfolioLayout>
        <NftPortfolioPageContent />
      </NftPortfolioLayout>
    </>
  );
};

export default NftPortfolioPage;
