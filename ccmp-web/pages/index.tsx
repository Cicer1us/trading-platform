import React from 'react';
import WideLayout from '@/layouts/WideLayout/WideLayout';
import CrossChainProtocol from 'pagesContent/CrossChainProtocol/CrossChainProtocol';

const CrossChainPage: React.FC = () => {
  return (
    <>
      <WideLayout>
        <CrossChainProtocol />
      </WideLayout>
    </>
  );
};

export default CrossChainPage;
