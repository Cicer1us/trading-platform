import AppLayout from '@/layouts/AppLayout/AppLayout';
import useMultilingual from '@/hooks/useMultilingual';
import MetaTags from '@/components/MetaTags/MetaTags';
import React from 'react';
import { FiatExchange } from '../../pagesContent/fiat-exchange/FiatExchange';

const TradingPage: React.FC = () => {
  const { t } = useMultilingual('tradingMetadata');

  return (
    <>
      <MetaTags
        title={t('fiatExchange')}
        description={t('seoDescription')}
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.come/trading`}
      />

      <AppLayout>
        <FiatExchange />
      </AppLayout>
    </>
  );
};

export default TradingPage;
