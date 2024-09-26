import axios from 'axios';
import { BOF_SERVER_BASE_URL } from 'src/common/constants';
import { Token } from 'src/connection/types';

export const getTokenLists = async (): Promise<Record<string, Token[]>> => {
  try {
    const { data } = await axios.get(`${BOF_SERVER_BASE_URL}/chain-config`);

    return data;
  } catch (error) {
    console.error('getTokenLists error', error);
    throw new Error('getTokenLists response failed');
  }
};
