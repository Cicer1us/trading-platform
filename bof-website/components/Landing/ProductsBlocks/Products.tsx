import React from 'react';
import ProductsDesktop from './ProductsDesktop/ProductsDesktop';
import ProductsMobile from './ProductsMobile/ProductsMobile';
import { useMediaQuery } from '@/common/hooks/use-media-query';

const Products = (): JSX.Element => {
  const isBreakpoint = useMediaQuery(1000);
  return <>{isBreakpoint ? <ProductsMobile /> : <ProductsDesktop />}</>;
};

export default React.memo(Products);
