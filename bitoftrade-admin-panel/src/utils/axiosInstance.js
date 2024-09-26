import axios from 'axios';

const instance = axios.create();

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // place your reentry code
      localStorage.removeItem('user');
    }
    return error;
  }
);

export default instance;
