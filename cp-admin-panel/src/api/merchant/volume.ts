import axios from 'axios';
import { subDays } from 'date-fns';
import { ALLPAY_SERVER_BASE_URL } from 'src/common/constants';

export type GetPaymentVolumeInterval = 'allTime' | 'lastMonth' | 'lastDay';

export const getPaymentsVolume = async (interval: GetPaymentVolumeInterval) => {
  // if we don't provide fromDate, server will count from Unix epoch
  const now = new Date();
  const params: { fromDate?: string; toDate?: string } = { toDate: now.toISOString() };
  switch (interval) {
    case 'lastMonth':
      params.fromDate = subDays(now, 30).toISOString();
      break;
    case 'lastDay':
      params.fromDate = subDays(now, 1).toISOString();
      break;
  }

  return axios.get<{ volume: number }>(`${ALLPAY_SERVER_BASE_URL}/payments/volume`, {
    params
  });
};
