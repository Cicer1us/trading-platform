import { useQuery } from '@tanstack/react-query';
import { GetPaymentVolumeInterval, getPaymentsVolume } from 'src/api/merchant/volume';
import { ONE_MINUTE } from 'src/common/time';

export const constructPaymentsVolumeCacheKey = (query: string) => ['volume', query];

export const usePaymentsVolume = (interval: GetPaymentVolumeInterval) =>
  useQuery({
    queryKey: constructPaymentsVolumeCacheKey(interval),
    queryFn: () => getPaymentsVolume(interval),
    cacheTime: ONE_MINUTE,
    staleTime: ONE_MINUTE
  });
