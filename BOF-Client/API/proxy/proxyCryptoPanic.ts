import cacheRequest, { CacheTimeout } from '@/common/cacheRequest';
import { CryptoPanicResponse } from '@/interfaces/Cryptopanic.interface';
import { CRYPTO_PANIC_URL } from 'constants/urls';

export default async function proxyCryptoPanic<T>(
  endpoint: string,
  query: Record<string, string> = {},
  cacheTimeout = CacheTimeout.FIVE_MIN
): Promise<CryptoPanicResponse<T>> {
  const url = new URL(`${CRYPTO_PANIC_URL}${endpoint}`);
  url.search = new URLSearchParams({ ...query, auth_token: process.env.CRYPTO_PANIC_TOKEN }).toString();

  return cacheRequest(url.toString(), {}, cacheTimeout);
}
