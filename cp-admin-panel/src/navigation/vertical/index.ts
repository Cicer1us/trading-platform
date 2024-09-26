// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types';
import { MERCHANT_SECURITY, MERCHANT_PAYMENTS, MERCHANT_VOLUMES } from 'src/common/locationPath';

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Security',
      path: MERCHANT_SECURITY,
      icon: 'mdi:home-outline'
    },
    {
      title: 'Payments',
      path: MERCHANT_PAYMENTS,
      icon: 'mdi:wallet-outline'
    },
    {
      title: 'Volumes',
      path: MERCHANT_VOLUMES,
      icon: 'iconoir:dollar'
    }
  ];
};

export default navigation;
