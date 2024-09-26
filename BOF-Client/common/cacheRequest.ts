import cache from 'memory-cache';

export enum CacheTimeout {
  ONE_MIN = 1000 * 60,
  FIVE_MIN = 1000 * 60 * 5,
  ONE_HOUR = 1000 * 60 * 60,
  ONE_DAY = 1000 * 60 * 60 * 24,
}

export const cacheRequest = async <T>(
  url: string,
  requestData: Record<string, any> = {},
  timeout: CacheTimeout = CacheTimeout.FIVE_MIN
): Promise<T | null> => {
  const cachedResponse = cache.get(url);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(url, requestData);

    if (response?.ok) {
      const json = await response.json();
      cache.put(url, json, timeout);
      return json;
    } else {
      console.error(response.statusText);
      cache.del(url);
      return null;
    }
  } catch (error) {
    console.error(error.message);
    cache.del(url);
    return null;
  }
};

export default cacheRequest;
