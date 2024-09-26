import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/Page404';
import SwapAndLimitStatisticEthereum from './pages/SwapAndLimitStatisticEthereum';
import SwapStatistic from './pages/SwapStatistic';
import LeverageStatistic from './pages/LeverageStatistic';
import Dashboard from './pages/Dashboard';
import AffiliateStatistic from './pages/AffiliateStatistic';
import { ChainId } from './constants';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <Dashboard /> },
        { path: 'swap-stats-ethereum', element: <SwapAndLimitStatisticEthereum /> },
        {
          path: 'swap-stats-filter-common',
          element: <SwapStatistic title="Swap Statistic (Polygon)" chainId={ChainId.Polygon} />
        },
        {
          path: 'swap-stats-binance',
          element: <SwapStatistic title="Swap Statistic (Binance)" chainId={ChainId.Binance} />
        },
        {
          path: 'swap-stats-avalanche',
          element: <SwapStatistic title="Swap Statistic (Avalanche)" chainId={ChainId.Avalanche} />
        },
        {
          path: 'swap-stats-fantom',
          element: <SwapStatistic title="Swap Statistic (Fantom)" chainId={ChainId.Fantom} />
        },
        { path: 'leverage-stats', element: <LeverageStatistic /> },
        { path: 'affiliate-stats', element: <AffiliateStatistic /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
