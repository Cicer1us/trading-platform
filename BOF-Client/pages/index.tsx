import AppLayout from '@/layouts/AppLayout/AppLayout';
import { InferGetServerSidePropsType } from 'next';
import Trading from 'pagesContent/Trading/Trading';
import getSwapSettings from 'API/swap/get-swap-settings';
import getLimitSettings from 'API/limit/getLimitSettings';
import { getTokens } from 'API/tokens/getTokens';
import DydxSocketProvider from 'providers/DydxSocketProvider';

export const getServerSideProps = async () => {
  try {
    const swapSettings = await getSwapSettings();
    const tokensList = await getTokens();
    const limitSettings = await getLimitSettings();
    return { props: { limitSettings, tokensList, swapSettings } };
  } catch (error) {
    return { props: {} };
  }
};

const TradingPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  return (
    <>
      <AppLayout>
        <DydxSocketProvider />
        <Trading />
      </AppLayout>
    </>
  );
};

export default TradingPage;
