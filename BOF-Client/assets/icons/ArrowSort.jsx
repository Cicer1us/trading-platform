import React from 'react';

export function ArrowSort({ color = 'var(--arrowColor)', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M9.99927 2.99975L9.99927 17.428"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.19727 10.626L9.99875 17.4275L16.8002 10.626"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
