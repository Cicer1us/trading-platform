import React from 'react';
import WideLayout from '@/layouts/WideLayout/WideLayout';
import Team from 'pagesContent/Team/Team';
import MetaTags from '@/components/MetaTags/MetaTags';

const TeamPage: React.FC = () => {
  return (
    <WideLayout>
      <MetaTags
        title="Team"
        description="Our team is made up of blockchain industry leaders, business professionals, 
        engineers, and web developers. We are committed to making NFTs mainstream and are working tirelessly to 
        be at the forefront of the technological revolution."
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.com/Team`}
      />
      <Team />
    </WideLayout>
  );
};

export default TeamPage;
