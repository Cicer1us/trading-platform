// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types';
import { MERCHANT_PAYMENTS, MERCHANT_SECURITY } from 'src/common/locationPath';

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Security',
    path: MERCHANT_SECURITY,
    icon: 'mdi:home-outline'
  },
  {
    title: 'Payments',
    path: MERCHANT_PAYMENTS,
    icon: 'mdi:wallet-outline'
  }
];

export default navigation;
