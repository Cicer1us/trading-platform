export const getLocalStorageValue = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return null;
};
