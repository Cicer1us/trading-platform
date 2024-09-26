import { SVGProps } from 'react';

export const ProgressStatusCompletedIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="1" y="1" width="22" height="22" rx="11" fill="#255558" />
    <path
      d="M15.75 9L10.5938 14.25L8.25 11.8636"
      stroke="#38D9C0"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="1" y="1" width="22" height="22" rx="11" stroke="#38D9C0" strokeWidth="2" />
  </svg>
);

export const ProgressStatusErrorIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="1" y="1" width="22" height="22" rx="11" fill="#4F303A" />
    <path d="M15 9L9 15" stroke="#FF6666" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 9L15 15" stroke="#FF6666" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="1" y="1" width="22" height="22" rx="11" stroke="#FF6666" strokeWidth="2" />
  </svg>
);
