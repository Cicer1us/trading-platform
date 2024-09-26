import axios from 'axios';
import { ALLPAY_SERVER_BASE_URL } from 'src/common/constants';
import { User } from 'src/common/types';

export const updateSubscriptionsUrls = async (urls: string[]): Promise<User> => {
  // TODO: rework this request to patch instead of put on the backend
  const { data: user } = await axios.put(`${ALLPAY_SERVER_BASE_URL}/merchants/subscriptions`, {
    subscriptionUrls: urls
  });

  return user;
};

export const rotateSharedSecret = async (): Promise<User> => {
  const { data: user } = await axios.post(`${ALLPAY_SERVER_BASE_URL}/merchants/rotate-secret`);

  return user;
};

export const updateWalletAddress = async (walletAddress: string): Promise<User> => {
  const { data } = await axios.post(`${ALLPAY_SERVER_BASE_URL}/merchants/wallet`, {
    walletAddress
  });

  return data;
};
