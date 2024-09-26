import axios from 'axios';

export const setAxiosAuthTokenGlobally = (storedAccessToken: string) => {
  /**
   * if user is successfully fetched,
   * then set the { Authorization: `Bearer ${storedAccessToken}` }
   * header for all axios requests
   *
   * NOTE: required to call this function only after getUser() is successfully called
   */
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`;
};

export const removeAxiosAuthTokenGlobally = () => {
  delete axios.defaults.headers.common['Authorization'];
};
