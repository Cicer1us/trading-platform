// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'Swap & Limit (Ethereum)',
    path: '/dashboard/swap-stats-ethereum',
    icon: getIcon('gridicons:stats-down')
  },
  {
    title: 'Swap (Polygon)',
    path: '/dashboard/swap-stats-filter-common',
    icon: getIcon('gridicons:stats-down')
  },
  {
    title: 'Swap (Binance)',
    path: '/dashboard/swap-stats-binance',
    icon: getIcon('gridicons:stats-down')
  },
  {
    title: 'Swap (Avalanche)',
    path: '/dashboard/swap-stats-avalanche',
    icon: getIcon('gridicons:stats-down')
  },
  {
    title: 'Swap (Fantom)',
    path: '/dashboard/swap-stats-fantom',
    icon: getIcon('gridicons:stats-down')
  },
  {
    title: 'Leverage',
    path: '/dashboard/leverage-stats',
    icon: getIcon('gridicons:stats-down')
  },
  {
    title: 'Affiliate',
    path: '/dashboard/affiliate-stats',
    icon: getIcon('tabler:affiliate')
  }
];

export default sidebarConfig;
