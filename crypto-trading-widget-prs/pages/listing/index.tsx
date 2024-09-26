import React from 'react';
import { MetaTags } from 'components/MetaTags/MetaTags';
import { Layout } from 'layouts/Layout';

const ListingDefaultPage: React.FC = () => {
  return (
    <>
      <MetaTags
        title="AllPay Customization"
        description="Design your widget today! Adjust the widget to your brand colors, choose what networks to work with."
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://allpay.bitoftrade.com/customisation`}
      />
      <Layout>
        <div>:)</div>
      </Layout>
    </>
  );
};

export default ListingDefaultPage;
