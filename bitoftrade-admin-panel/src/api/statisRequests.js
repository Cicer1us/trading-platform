export const getSwapStatsConfig = (chainId, dateFrom, referrer) => ({
  method: 'get',
  url: `/swap/stats`,
  baseURL: process.env.REACT_APP_SERVER_URL,
  params: {
    dateFrom,
    chainId,
    referrer: referrer === 'all' ? undefined : referrer
  }
});

export const getLeverageStatsConfig = (dateFrom) => ({
  method: 'get',
  url: `/leverage-trade/stats`,
  baseURL: process.env.REACT_APP_SERVER_URL,
  params: {
    dateFrom
  }
});

export const getLimitStatsConfig = (dateFrom) => ({
  method: 'get',
  url: `/limit-order/stats`,
  baseURL: process.env.REACT_APP_SERVER_URL,
  params: {
    status: 'Filled',
    dateFrom
  }
});

export const getSwapUniqueUsersConfig = (chainId, dateFrom, referrer) => ({
  method: 'get',
  url: `/swap/unique-users`,
  baseURL: process.env.REACT_APP_SERVER_URL,
  params: {
    dateFrom,
    chainId,
    referrer: referrer === 'all' ? undefined : referrer
  }
});

export const getLeverageUniqueUsersConfig = (dateFrom) => ({
  method: 'get',
  url: `/leverage-trade/unique-users`,
  baseURL: process.env.REACT_APP_SERVER_URL,
  params: {
    dateFrom
  }
});

export const getLimitUniqueUsersConfig = (dateFrom) => ({
  method: 'get',
  url: `/limit-order/unique-users`,
  baseURL: process.env.REACT_APP_SERVER_URL,
  params: {
    status: 'Filled',
    dateFrom
  }
});
