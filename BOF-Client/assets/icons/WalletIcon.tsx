import * as React from 'react';
import { SVGProps } from 'react';

const WalletIcon = ({ stroke = 'var(--arrowColor)' }: SVGProps<SVGSVGElement>) => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1210_2455)">
      <path
        d="M17.9999 3.3335H2.99992C2.07944 3.3335 1.33325 4.07969 1.33325 5.00016V15.0002C1.33325 15.9206 2.07944 16.6668 2.99992 16.6668H17.9999C18.9204 16.6668 19.6666 15.9206 19.6666 15.0002V5.00016C19.6666 4.07969 18.9204 3.3335 17.9999 3.3335Z"
        stroke={stroke || 'var(--arrowColor)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8333 7.5L19.6666 7.5"
        stroke={stroke || 'var(--arrowColor)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8333 7.5C12.9999 7.5 11.3333 8 11.3333 10C11.3333 12 12.9999 12.5 13.8333 12.5"
        stroke={stroke || 'var(--arrowColor)'}
        strokeWidth="2"
      />
      <path
        d="M13.8333 12.5L19.6666 12.5"
        stroke={stroke || 'var(--arrowColor)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1210_2455">
        <rect width="20" height="20" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export default WalletIcon;
