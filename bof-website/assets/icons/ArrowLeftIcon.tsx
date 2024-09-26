import * as React from 'react';

const ArrowLeftIcon = ({ width = 8, height = 14, ...props }) => (
  <svg width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7 13 1 7l6-6" stroke="#A1AEC2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ArrowLeftIcon;
