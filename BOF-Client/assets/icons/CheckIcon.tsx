import * as React from 'react';
import { SVGProps } from 'react';

const CheckMarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={21} height={17} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2 11.1 5.923 15 19 2" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CheckMarkIcon;
