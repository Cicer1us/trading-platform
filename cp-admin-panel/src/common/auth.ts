// keys
export const ACCESS_TOKEN = 'accessToken';
export const SETTINGS = 'settings';

// helpers
export const getAccessToken = () => window.localStorage.getItem(ACCESS_TOKEN) ?? '';
export const setAccessToken = (accessToken: string) => window.localStorage.setItem(ACCESS_TOKEN, accessToken);
export const removeAccessToken = () => window.localStorage.removeItem(ACCESS_TOKEN);
